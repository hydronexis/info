import { db } from "./firebase-config.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

await requirePageAccess();

const grid = document.getElementById("marketplace-live-grid");
const status = document.getElementById("marketplace-live-status");
const search = document.getElementById("marketplace-search");
const filters = {
  category: document.getElementById("marketplace-live-category"),
  availability: document.getElementById("marketplace-live-availability"),
  seller: document.getElementById("marketplace-live-seller"),
  location: document.getElementById("marketplace-live-location"),
  operation: document.getElementById("marketplace-live-operation"),
  minimumPrice: document.getElementById("marketplace-live-min-price"),
  maximumPrice: document.getElementById("marketplace-live-max-price")
};
let products = [];

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}

function productCard(product) {
  const column = document.createElement("div");
  column.className = "col-sm-6 col-xl-4 marketplace-live-product";
  column.dataset.searchText = `${product.name || ""} ${product.sellerName || ""} ${product.category || ""}`.toLowerCase();
  const article = document.createElement("article");
  article.className = "product marketplace-live-card";
  const body = document.createElement("div");
  body.className = "product-body";
  const figure = document.createElement("div");
  figure.className = "product-figure";
  if (product.image) {
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.width = 220;
    image.height = 160;
    figure.appendChild(image);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "marketplace-live-placeholder";
    placeholder.textContent = "[IMAGE REQUIRED]";
    figure.appendChild(placeholder);
  }
  const title = document.createElement("h5");
  title.className = "product-title";
  const link = document.createElement("a");
  link.href = `marketplace-product.html?id=${encodeURIComponent(product.id)}`;
  link.textContent = product.name;
  title.appendChild(link);
  const seller = document.createElement("p");
  seller.textContent = product.sellerName || "HYDRONEXIS Seller";
  const price = document.createElement("div");
  price.className = "product-price";
  price.textContent = product.status === "out_of_stock"
    ? "Out of stock"
    : `${formatMoney(product.price)} · ${product.stock} available`;
  body.append(figure, title, seller, price);
  const buttonWrap = document.createElement("div");
  buttonWrap.className = "product-button-wrap";
  const button = document.createElement("a");
  button.className = "button button-primary button-zakaria";
  button.href = link.href;
  button.textContent = "View";
  buttonWrap.appendChild(button);
  article.append(body, buttonWrap);
  column.appendChild(article);
  return column;
}

function render() {
  const term = search?.value.trim().toLowerCase() || "";
  const minimumPrice = filters.minimumPrice?.value === "" ? 0 : Number(filters.minimumPrice?.value);
  const maximumPrice = filters.maximumPrice?.value === "" ? Number.POSITIVE_INFINITY : Number(filters.maximumPrice?.value);
  const visible = products.filter((product) => {
    const searchable = `${product.name || ""} ${product.sellerName || ""} ${product.category || ""} ${product.location || ""}`.toLowerCase();
    const price = Number(product.price);
    return (!term || searchable.includes(term))
      && (!filters.category?.value || product.category === filters.category.value)
      && (!filters.availability?.value || product.status === filters.availability.value)
      && (!filters.seller?.value || product.sellerName === filters.seller.value)
      && (!filters.location?.value || product.location === filters.location.value)
      && (!filters.operation?.value
        || filters.operation.value === "sale"
        || (filters.operation.value === "exchange" && product.exchangeEnabled === true))
      && Number.isFinite(price)
      && price >= minimumPrice
      && price <= maximumPrice;
  });
  grid.replaceChildren(...visible.map(productCard));
  status.textContent = products.length
    ? `${visible.length} of ${products.length} published seller products shown.`
    : "No Go Green seller products have been published yet.";
}

function fillFilter(select, values, placeholder) {
  if (!select) return;
  const selected = select.value;
  select.replaceChildren(new Option(placeholder, ""));
  [...new Set(values.filter((value) => typeof value === "string" && value.trim()).map((value) => value.trim()))]
    .sort((left, right) => left.localeCompare(right))
    .forEach((value) => select.add(new Option(value, value)));
  select.value = selected;
}

function prepareFilters() {
  fillFilter(filters.category, products.map((product) => product.category), "All categories");
  fillFilter(filters.seller, products.map((product) => product.sellerName), "All sellers");
  fillFilter(filters.location, products.map((product) => product.location), "All locations");
}

try {
  const snapshot = await getDocs(query(
    collection(db, "products"),
    where("status", "in", ["available", "low_stock", "out_of_stock"])
  ));
  products = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  prepareFilters();
  render();
  let timer;
  search?.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(render, 250);
  });
  Object.values(filters).forEach((control) => control?.addEventListener("change", render));
  filters.minimumPrice?.addEventListener("input", render);
  filters.maximumPrice?.addEventListener("input", render);
} catch {
  status.textContent = "Published seller products could not be loaded. Verify Firebase Rules and your connection.";
}
