import {
  clearCart,
  getCart,
  getCartSummary,
  initializeCart,
  removeCartItem,
  updateCartQuantity
} from "./cart-store.js";
import { requirePageAccess } from "./plan-guard.js";

await requirePageAccess();

const list = document.getElementById("cartItems");
const emptyState = document.getElementById("cartEmptyState");
const subtotal = document.getElementById("cartSubtotal");
const total = document.getElementById("cartTotal");
const count = document.getElementById("cartItemCount");
const checkoutLink = document.getElementById("cartCheckoutLink");
const feedback = document.getElementById("cartFeedback");

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}

function showFeedback(message, isError = false) {
  if (!feedback) return;
  feedback.textContent = message;
  feedback.hidden = false;
  feedback.classList.toggle("is-error", isError);
}

function createItem(item) {
  const card = document.createElement("article");
  card.className = "commerce-cart-item";
  card.dataset.productId = item.productId;
  card.dataset.sellerId = item.sellerId;

  let media;
  if (item.image) {
    media = document.createElement("img");
    media.src = item.image;
    media.alt = item.name;
    media.width = 110;
    media.height = 90;
  } else {
    media = document.createElement("div");
    media.className = "commerce-product-placeholder";
    media.textContent = "[IMAGE REQUIRED]";
    media.setAttribute("role", "img");
    media.setAttribute("aria-label", `Image required for ${item.name}`);
  }

  const copy = document.createElement("div");
  copy.className = "commerce-cart-copy";
  const title = document.createElement("h2");
  title.textContent = item.name;
  const seller = document.createElement("p");
  seller.textContent = `Seller: ${item.sellerName}`;
  const note = document.createElement("small");
  note.textContent = item.maxQuantity
    ? `Published stock limit: ${item.maxQuantity}. Price and stock will be revalidated before an order is created.`
    : "Displayed price and stock will be revalidated before an order is created.";
  copy.append(title, seller, note);

  const controls = document.createElement("div");
  controls.className = "commerce-cart-controls";
  const label = document.createElement("label");
  label.textContent = "Quantity";
  const input = document.createElement("input");
  input.type = "number";
  input.min = "1";
  input.max = String(item.maxQuantity || 999);
  input.value = String(item.quantity);
  input.setAttribute("aria-label", `Quantity for ${item.name}`);
  const remove = document.createElement("button");
  remove.type = "button";
  remove.dataset.action = "remove";
  remove.textContent = "Remove";
  const price = document.createElement("strong");
  price.textContent = formatMoney(item.displayPrice * item.quantity);
  label.appendChild(input);
  controls.append(label, price, remove);
  card.append(media, copy, controls);
  return card;
}

async function renderCart() {
  const items = await getCart();
  const summary = await getCartSummary();
  list.replaceChildren(...items.map(createItem));
  emptyState.hidden = items.length > 0;
  list.hidden = items.length === 0;
  subtotal.textContent = formatMoney(summary.displaySubtotal);
  total.textContent = formatMoney(summary.displaySubtotal);
  count.textContent = `${summary.itemCount} ${summary.itemCount === 1 ? "item" : "items"}`;
  checkoutLink.setAttribute("aria-disabled", String(items.length === 0));
  checkoutLink.classList.toggle("is-disabled", items.length === 0);
}

list?.addEventListener("change", async (event) => {
  const input = event.target.closest('input[type="number"]');
  if (!input) return;
  const item = input.closest("[data-product-id]");
  await updateCartQuantity(item.dataset.productId, item.dataset.sellerId, input.value);
  await renderCart();
});

list?.addEventListener("click", async (event) => {
  const button = event.target.closest('[data-action="remove"]');
  if (!button) return;
  const item = button.closest("[data-product-id]");
  button.disabled = true;
  await removeCartItem(item.dataset.productId, item.dataset.sellerId);
  await renderCart();
});

document.getElementById("cartClearButton")?.addEventListener("click", async () => {
  await clearCart();
  await renderCart();
  showFeedback("Your cart is empty.");
});

checkoutLink?.addEventListener("click", (event) => {
  if (checkoutLink.classList.contains("is-disabled")) {
    event.preventDefault();
    showFeedback("Add at least one available product before checkout.", true);
  }
});

document.addEventListener("hydronexisCartSyncError", (event) => {
  showFeedback(event.detail.message, true);
});

await initializeCart();
await renderCart();
