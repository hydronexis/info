import { db } from "./firebase-config.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const session = await requirePageAccess();
const feedback = document.getElementById("sellerFeedback");
const productList = document.getElementById("sellerProductList");
const orderList = document.getElementById("sellerOrderList");
const form = document.getElementById("sellerProductForm");
let products = [];
let orders = [];

function displayName() {
  return session.profile?.name?.trim()
    || session.user.displayName?.trim()
    || session.user.email?.split("@")[0]
    || "HYDRONEXIS Seller";
}

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.hidden = false;
  feedback.style.background = isError ? "#fff0ec" : "#eff5ec";
  feedback.style.color = isError ? "#8b2d1e" : "#285421";
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}

function formatDate(value) {
  const date = value?.toDate?.() || (value ? new Date(value) : null);
  if (!date || Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

function statusFor(stock, availability = "available") {
  if (availability === "inactive") return "inactive";
  if (stock <= 0) return "out_of_stock";
  if (stock <= 3) return "low_stock";
  return "available";
}

function resetForm() {
  form.reset();
  document.getElementById("sellerProductId").value = "";
  document.getElementById("sellerFormTitle").textContent = "Create Product";
  document.getElementById("sellerSaveButton").textContent = "Publish Product";
  document.getElementById("sellerCancelEdit").hidden = true;
}

function editProduct(product) {
  document.getElementById("sellerProductId").value = product.id;
  document.getElementById("sellerProductName").value = product.name || "";
  document.getElementById("sellerProductDescription").value = product.description || "";
  document.getElementById("sellerProductCategory").value = product.category || "";
  document.getElementById("sellerProductPrice").value = String(product.price ?? "");
  document.getElementById("sellerProductStock").value = String(product.stock ?? 0);
  document.getElementById("sellerProductAvailability").value = product.status === "inactive" ? "inactive" : "available";
  document.getElementById("sellerProductLocation").value = product.location || "";
  document.getElementById("sellerProductImage").value = product.image || "";
  document.getElementById("sellerProductExchange").checked = Boolean(product.exchangeEnabled);
  document.getElementById("sellerFormTitle").textContent = "Edit Product";
  document.getElementById("sellerSaveButton").textContent = "Save Product";
  document.getElementById("sellerCancelEdit").hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function productCard(product) {
  const card = document.createElement("article");
  card.className = "account-list-item";
  card.dataset.productId = product.id;
  const details = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = product.name;
  const copy = document.createElement("p");
  copy.textContent = `${formatMoney(product.price)} · Stock: ${product.stock} · ${product.category || "Uncategorized"}`;
  const operation = document.createElement("p");
  operation.textContent = product.exchangeEnabled ? "For Sale & Available for Exchange" : "For Sale";
  const controls = document.createElement("div");
  controls.className = "commerce-actions";
  [
    ["Edit", "edit"],
    ["Stock -", "stock-down"],
    ["Stock +", "stock-up"],
    [product.status === "inactive" ? "Activate" : "Disable", "toggle-status"]
  ].forEach(([label, action]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = action === "toggle-status" ? "commerce-clear-button" : "button button-sm button-secondary button-zakaria";
    button.dataset.action = action;
    button.textContent = label;
    controls.appendChild(button);
  });
  details.append(title, copy, operation, controls);
  const status = document.createElement("span");
  status.className = "account-list-item-status";
  status.textContent = product.status;
  card.append(details, status);
  return card;
}

function renderProducts() {
  productList.replaceChildren();
  if (!products.length) {
    const empty = document.createElement("p");
    empty.className = "account-empty";
    empty.textContent = "You haven't published any products yet.";
    productList.appendChild(empty);
  } else {
    productList.append(...products.map(productCard));
  }
  document.getElementById("sellerProductCount").textContent = String(products.filter((item) => item.status !== "inactive").length);
  document.getElementById("sellerLowStockCount").textContent = String(products.filter((item) =>
    item.status === "low_stock" || item.status === "out_of_stock").length);
}

function orderCard(order) {
  const card = document.createElement("article");
  card.className = "account-list-item";
  const details = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = `Order ${order.orderId || order.id}`;
  const sellerItems = Array.isArray(order.items)
    ? order.items.filter((item) => item.sellerId === session.user.uid)
    : [];
  const quantity = sellerItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const itemSummary = sellerItems.length
    ? sellerItems.map((item) => `${item.name || "Product"} x ${Number(item.quantity) || 1}`).join(", ")
    : "Product details awaiting backend data";
  const sellerAmount = order.sellerAmounts?.[session.user.uid];
  const copy = document.createElement("p");
  const itemsCopy = document.createElement("p");
  itemsCopy.textContent = `${formatDate(order.createdAt)} | ${itemSummary} | Quantity: ${quantity || "Awaiting backend data"}`;
  copy.textContent = `Status: ${order.status || "pending"} · Seller amount: ${sellerAmount == null ? "Awaiting backend calculation" : formatMoney(sellerAmount)}`;
  details.append(title, itemsCopy, copy);
  const status = document.createElement("span");
  status.className = "account-list-item-status";
  status.textContent = order.paymentStatus || "pending";
  card.append(details, status);
  return card;
}

function renderOrders() {
  orderList.replaceChildren();
  if (!orders.length) {
    const empty = document.createElement("p");
    empty.className = "account-empty";
    empty.textContent = "No seller orders found.";
    orderList.appendChild(empty);
  } else {
    orderList.append(...orders.map(orderCard));
  }
  document.getElementById("sellerOrderCount").textContent = String(orders.length);
  const verifiedSales = orders
    .filter((order) => order.status === "completed" && order.paymentStatus === "paid")
    .reduce((sum, order) => sum + (Number(order.sellerAmounts?.[session.user.uid]) || 0), 0);
  document.getElementById("sellerSalesTotal").textContent = formatMoney(verifiedSales);
}

async function loadSellerData() {
  const [productSnapshot, orderSnapshot] = await Promise.all([
    getDocs(query(collection(db, "products"), where("sellerId", "==", session.user.uid))),
    getDocs(query(collection(db, "orders"), where("sellerIds", "array-contains", session.user.uid)))
  ]);
  products = productSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  orders = orderSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  renderProducts();
  renderOrders();
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const productId = String(data.get("productId") || "");
  const price = Number(data.get("price"));
  const stock = Math.trunc(Number(data.get("stock")));
  if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    showFeedback("Price and stock must be valid non-negative numbers.", true);
    return;
  }

  const button = document.getElementById("sellerSaveButton");
  button.disabled = true;
  const payload = {
    sellerId: session.user.uid,
    sellerName: displayName(),
    name: String(data.get("name") || "").trim(),
    description: String(data.get("description") || "").trim(),
    category: String(data.get("category") || "").trim(),
    price,
    stock,
    status: statusFor(stock, String(data.get("availability") || "available")),
    location: String(data.get("location") || "").trim(),
    image: String(data.get("image") || "").trim(),
    exchangeEnabled: data.get("exchangeEnabled") === "on",
    updatedAt: serverTimestamp()
  };

  try {
    if (productId) {
      await updateDoc(doc(db, "products", productId), payload);
      showFeedback("Product updated.");
    } else {
      await addDoc(collection(db, "products"), { ...payload, createdAt: serverTimestamp() });
      showFeedback("Product published in the Marketplace.");
    }
    resetForm();
    await loadSellerData();
  } catch {
    showFeedback("The product could not be saved.", true);
  } finally {
    button.disabled = false;
  }
});

document.getElementById("sellerCancelEdit")?.addEventListener("click", resetForm);

productList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const card = button.closest("[data-product-id]");
  const product = products.find((item) => item.id === card.dataset.productId);
  if (!product) return;
  if (button.dataset.action === "edit") {
    editProduct(product);
    return;
  }
  if (button.dataset.action === "toggle-status" && !window.confirm(
    product.status === "inactive" ? "Activate this product?" : "Disable this product?"
  )) return;

  button.disabled = true;
  try {
    if (button.dataset.action === "toggle-status") {
      const nextStatus = product.status === "inactive" ? statusFor(product.stock) : "inactive";
      await updateDoc(doc(db, "products", product.id), {
        status: nextStatus,
        updatedAt: serverTimestamp()
      });
    } else {
      const delta = button.dataset.action === "stock-up" ? 1 : -1;
      await runTransaction(db, async (transaction) => {
        const reference = doc(db, "products", product.id);
        const snapshot = await transaction.get(reference);
        if (!snapshot.exists() || snapshot.data().sellerId !== session.user.uid) {
          throw new Error("Product unavailable");
        }
        const nextStock = Math.max(0, Number(snapshot.data().stock || 0) + delta);
        transaction.update(reference, {
          stock: nextStock,
          status: statusFor(nextStock),
          updatedAt: serverTimestamp()
        });
      });
    }
    await loadSellerData();
    showFeedback("Inventory updated.");
  } catch {
    showFeedback("Inventory could not be updated.", true);
    button.disabled = false;
  }
});

try {
  await loadSellerData();
} catch {
  products = [];
  orders = [];
  renderProducts();
  renderOrders();
  showFeedback("Seller data could not be loaded. Verify Firebase Rules and required indexes.", true);
}
