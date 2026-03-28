// ===== CART LOGIC =====
// Cart data lives in localStorage so it persists across pages.

function getCart() {
  return JSON.parse(localStorage.getItem("volt_cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("volt_cart", JSON.stringify(cart));
}
function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function addToCart(product, size = product.sizes?.[0] || "M", qty = 1) {
  const cart = getCart();
  const key = `${product.id}_${size}`;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      price: product.price,
      size,
      qty,
      image: product.image,
      placeholder: product.placeholder,
      bgColor: product.bgColor,
    });
  }
  saveCart(cart);
  updateCartUI();
  showToast(`"${product.name}" added to bag!`);
}

function removeFromCart(key) {
  const cart = getCart().filter(i => i.key !== key);
  saveCart(cart);
  updateCartUI();
  renderCartPage?.();
}

function updateQty(key, delta) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  updateCartUI();
  renderCartPage?.();
}

function clearCart() {
  localStorage.removeItem("volt_cart");
  updateCartUI();
}

function updateCartUI() {
  const count = getCartCount();
  const el = document.getElementById("cartCount");
  if (!el) return;
  el.textContent = count;
  el.classList.remove("bump");
  void el.offsetWidth; // reflow
  el.classList.add("bump");
  setTimeout(() => el.classList.remove("bump"), 300);
}

function showToast(msg) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// Init on load
document.addEventListener("DOMContentLoaded", updateCartUI);
