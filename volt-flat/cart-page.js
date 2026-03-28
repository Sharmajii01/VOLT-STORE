// ===== CART PAGE JS =====

// Expose renderCartPage so cart.js can call it on updates
function renderCartPage() {
  const cart = getCart();
  const itemsEl = document.getElementById("cartItems");
  const summaryEl = document.getElementById("cartSummary");
  const subtitleEl = document.getElementById("cartSubtitle");
  if (!itemsEl) return;

  const count = cart.reduce((s, i) => s + i.qty, 0);
  if (subtitleEl) {
    subtitleEl.textContent = count === 0
      ? "Your bag is empty."
      : `${count} item${count !== 1 ? "s" : ""} in your bag`;
    subtitleEl.classList.add("revealed");
  }

  // ── Empty state ──
  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍️</div>
        <h3>Bag's empty.</h3>
        <p>Time to fix that.</p>
        <a href="shop.html" class="btn-primary">Shop Now</a>
      </div>`;
    summaryEl.innerHTML = "";
    return;
  }

  // ── Cart items ──
  itemsEl.innerHTML = cart.map(item => {
    const imageHTML = item.image
      ? `<img src="${item.image}" alt="${item.name}" />`
      : `${item.placeholder || "?"}`;

    return `
      <div class="cart-item" data-key="${item.key}">
        <div class="cart-item-image">${imageHTML}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-size">Size: ${item.size}</div>
          <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString("en-IN")}</div>
        </div>
        <div class="cart-item-actions">
          <div class="qty-control">
            <button class="qty-btn" data-action="dec" data-key="${item.key}">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-key="${item.key}">+</button>
          </div>
          <button class="remove-btn" data-key="${item.key}">Remove</button>
        </div>
      </div>`;
  }).join("");

  // Bind qty/remove buttons
  itemsEl.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const delta = btn.dataset.action === "inc" ? 1 : -1;
      updateQty(btn.dataset.key, delta);
    });
  });
  itemsEl.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.key));
  });

  // ── Order Summary ──
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= 999 ? 0 : 99;
  const total = subtotal + delivery;

  summaryEl.innerHTML = `
    <div class="summary-title">Order Summary</div>
    <div class="summary-row">
      <span>Subtotal (${count} items)</span>
      <span>₹${subtotal.toLocaleString("en-IN")}</span>
    </div>
    <div class="summary-row">
      <span>Delivery</span>
      <span>${delivery === 0 ? '<span class="summary-free">FREE</span>' : "₹" + delivery}</span>
    </div>
    ${delivery > 0 ? `<div class="summary-row"><span style="font-size:0.78rem;color:var(--gray)">Add ₹${(999 - subtotal).toLocaleString("en-IN")} more for free delivery</span></div>` : ""}
    <div class="summary-row total">
      <span>Total</span>
      <span>₹${total.toLocaleString("en-IN")}</span>
    </div>
    <button class="checkout-btn" id="checkoutBtn">Proceed to Checkout</button>
    <p class="checkout-note">🔒 Secured by Razorpay · COD available</p>
  `;

  document.getElementById("checkoutBtn")?.addEventListener("click", handleCheckout);
}

function handleCheckout() {
  const cart = getCart();
  if (cart.length === 0) return;

  // ── Razorpay integration ──
  // To enable real payments:
  // 1. Create Razorpay account at razorpay.com
  // 2. Get your Key ID from Dashboard → Settings → API Keys
  // 3. Replace "YOUR_RAZORPAY_KEY_ID" below
  // 4. Set up a backend to create an order_id (see DEPLOYMENT_GUIDE.md)

  const RAZORPAY_KEY = "YOUR_RAZORPAY_KEY_ID"; // ← Replace this

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= 999 ? 0 : 99;
  const total = subtotal + delivery;

  if (RAZORPAY_KEY === "YOUR_RAZORPAY_KEY_ID") {
    showToast("💳 Razorpay not configured yet. See DEPLOYMENT_GUIDE.md");
    return;
  }

  const options = {
    key: RAZORPAY_KEY,
    amount: total * 100, // paise
    currency: "INR",
    name: "VŌLT",
    description: `Order (${cart.reduce((s,i) => s + i.qty, 0)} items)`,
    handler: function(response) {
      // Payment success — send to your backend to verify
      showToast("✅ Payment successful! Order placed.");
      clearCart();
      renderCartPage();
      // TODO: POST response.razorpay_payment_id to your server
    },
    prefill: {},
    theme: { color: "#d4ff00" },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

document.addEventListener("DOMContentLoaded", () => {
  // Reveal cart header
  setTimeout(() => {
    document.querySelectorAll(".cart-header .reveal-up").forEach(el => el.classList.add("revealed"));
  }, 100);

  renderCartPage();
});
