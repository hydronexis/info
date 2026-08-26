import { db } from "./firebase-config.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const feedback = document.getElementById("exchangeFeedback");
const offeredSelect = document.getElementById("offeredItem");
const requestedSelect = document.getElementById("requestedItem");
const exchangeList = document.getElementById("exchangeList");
const session = await requirePageAccess();
let ownItems = [];
let publicItems = [];

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.hidden = false;
  feedback.style.background = isError ? "#fff0ec" : "#eff5ec";
  feedback.style.color = isError ? "#8b2d1e" : "#285421";
}

function option(value, label) {
  const node = document.createElement("option");
  node.value = value;
  node.textContent = label;
  return node;
}

function fillSelects() {
  offeredSelect.replaceChildren(option("", ownItems.length ? "Select your item" : "Register an item first"));
  ownItems.filter((item) => item.status === "active").forEach((item) => {
    offeredSelect.appendChild(option(item.id, item.name));
  });

  const available = publicItems.filter((item) => item.ownerId !== session.user.uid);
  requestedSelect.replaceChildren(option("", available.length ? "Select an item" : "No exchange items available"));
  available.forEach((item) => {
    requestedSelect.appendChild(option(item.id, item.name));
  });
}

async function loadItems() {
  const [ownSnapshot, publicSnapshot] = await Promise.all([
    getDocs(query(collection(db, "exchangeItems"), where("ownerId", "==", session.user.uid))),
    getDocs(query(collection(db, "exchangeItems"), where("status", "==", "active")))
  ]);
  ownItems = ownSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  publicItems = publicSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  fillSelects();
}

function itemName(id) {
  return [...ownItems, ...publicItems].find((item) => item.id === id)?.name || "Exchange item";
}

function actionButton(label, status) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button button-sm button-secondary button-zakaria";
  button.dataset.nextStatus = status;
  button.textContent = label;
  return button;
}

function renderExchange(exchange) {
  const card = document.createElement("article");
  card.className = "account-list-item";
  card.dataset.exchangeId = exchange.id;
  const details = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = `${itemName(exchange.offeredProductId)} for ${itemName(exchange.requestedProductId)}`;
  const role = exchange.creatorId === session.user.uid ? "Sent request" : "Received request";
  const copy = document.createElement("p");
  copy.textContent = exchange.message ? `${role} · ${exchange.message}` : role;
  const actions = document.createElement("div");
  actions.className = "commerce-actions";

  if (exchange.status === "pending" && exchange.creatorId === session.user.uid) {
    actions.appendChild(actionButton("Cancel", "cancelled"));
  }
  if (exchange.status === "pending" && exchange.receiverId === session.user.uid) {
    actions.append(actionButton("Accept", "accepted"), actionButton("Reject", "rejected"));
  }
  if (exchange.status === "accepted") {
    actions.appendChild(actionButton("Mark Completed", "completed"));
  }

  details.append(title, copy, actions);
  const status = document.createElement("span");
  status.className = "account-list-item-status";
  status.textContent = exchange.status;
  card.append(details, status);
  return card;
}

const EXCHANGE_GROUPS = Object.freeze([
  { title: "Pending", statuses: ["pending"] },
  { title: "Accepted", statuses: ["accepted"] },
  { title: "Completed", statuses: ["completed"] },
  { title: "Cancelled", statuses: ["cancelled", "rejected"] }
]);

async function loadExchanges() {
  const [createdSnapshot, receivedSnapshot] = await Promise.all([
    getDocs(query(collection(db, "exchanges"), where("creatorId", "==", session.user.uid))),
    getDocs(query(collection(db, "exchanges"), where("receiverId", "==", session.user.uid)))
  ]);
  const merged = new Map();
  [...createdSnapshot.docs, ...receivedSnapshot.docs].forEach((entry) => {
    merged.set(entry.id, { id: entry.id, ...entry.data() });
  });
  const exchanges = [...merged.values()].sort((a, b) =>
    (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  exchangeList.replaceChildren();
  if (!exchanges.length) {
    const empty = document.createElement("p");
    empty.className = "account-empty";
    empty.textContent = "No exchanges found.";
    exchangeList.appendChild(empty);
    return;
  }
  EXCHANGE_GROUPS.forEach((group) => {
    const section = document.createElement("section");
    section.className = "account-section";
    section.setAttribute("aria-labelledby", `exchange-group-${group.title.toLowerCase()}`);
    const heading = document.createElement("h3");
    heading.id = `exchange-group-${group.title.toLowerCase()}`;
    heading.textContent = group.title;
    const groupList = document.createElement("div");
    groupList.className = "account-list";
    const matching = exchanges.filter((exchange) => group.statuses.includes(exchange.status));
    if (matching.length) {
      groupList.append(...matching.map(renderExchange));
    } else {
      const empty = document.createElement("p");
      empty.className = "account-empty";
      empty.textContent = `No ${group.title.toLowerCase()} exchanges.`;
      groupList.appendChild(empty);
    }
    section.append(heading, groupList);
    exchangeList.appendChild(section);
  });
}

document.getElementById("exchangeItemForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const data = new FormData(form);
  button.disabled = true;
  try {
    await addDoc(collection(db, "exchangeItems"), {
      ownerId: session.user.uid,
      name: String(data.get("name") || "").trim(),
      description: String(data.get("description") || "").trim(),
      image: "",
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    form.reset();
    await loadItems();
    showFeedback("Your item is now available for exchange.");
  } catch {
    showFeedback("The exchange item could not be saved.", true);
  } finally {
    button.disabled = false;
  }
});

document.getElementById("exchangeRequestForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = document.getElementById("exchangeSubmitButton");
  const data = new FormData(form);
  const requestedItem = publicItems.find((item) => item.id === data.get("requestedItem"));
  if (!requestedItem) {
    showFeedback("Select an available item from another member.", true);
    return;
  }

  button.disabled = true;
  try {
    await addDoc(collection(db, "exchanges"), {
      creatorId: session.user.uid,
      receiverId: requestedItem.ownerId,
      offeredProductId: String(data.get("offeredItem")),
      requestedProductId: requestedItem.id,
      message: String(data.get("message") || "").trim(),
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    form.reset();
    await loadExchanges();
    showFeedback("Exchange request sent.");
  } catch {
    showFeedback("The exchange request could not be created.", true);
  } finally {
    button.disabled = false;
  }
});

exchangeList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-next-status]");
  if (!button) return;
  const card = button.closest("[data-exchange-id]");
  button.disabled = true;
  try {
    await updateDoc(doc(db, "exchanges", card.dataset.exchangeId), {
      status: button.dataset.nextStatus,
      updatedAt: serverTimestamp()
    });
    await loadExchanges();
    showFeedback("Exchange status updated.");
  } catch {
    showFeedback("This exchange action is not permitted or could not be saved.", true);
    button.disabled = false;
  }
});

try {
  await loadItems();
  await loadExchanges();
  if (new URLSearchParams(location.search).has("product")) {
    showFeedback("Register an eligible item below, then choose an available exchange item. Marketplace products do not automatically become exchange listings.");
  }
} catch {
  fillSelects();
  exchangeList.innerHTML = '<p class="account-empty">Exchange data could not be loaded.</p>';
  showFeedback("Exchange data could not be loaded. Verify Firebase Rules and your connection.", true);
}
