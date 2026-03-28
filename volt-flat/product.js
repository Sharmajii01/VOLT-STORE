// ===== PRODUCT DETAIL PAGE JS =====
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const product = PRODUCTS.find(p => p.id === id);
  const container = document.getElementById("productPage");

  if (!product) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:6rem 0;">
        <h2 style="font-family:var(--font-display);font-size:3rem;color:var(--volt)">404</h2>
        <p style="color:var(--gray);margin:1rem 0 2rem">Product not found.</p>
        <a href="shop.html" class="btn-primary">Back to Shop</a>
      </div>`;
    return;
  }

  // Update page title
  document.title = `${product.name} — VŌLT`;

  // Discount calc
  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const badgeClass = product.badge ? `badge-${product.badge}` : "";
  const badgeText  = product.badge
    ? (product.badge === "hot" ? "🔥 Hot" : product.badge.charAt(0).toUpperCase() + product.badge.slice(1))
    : "";

  const imageHTML = product.image
    ? `<img src="${product.image}" alt="${product.name}" />`
    : `<div class="gallery-placeholder" style="background:${product.bgColor}">${product.placeholder}</div>`;

  const originalPriceHTML = product.originalPrice
    ? `<span class="product-details-original">₹${product.originalPrice.toLocaleString("en-IN")}</span>
       <span class="product-details-discount">${discountPct}% OFF</span>`
    : "";

  const sizePills = product.sizes.map(s =>
    `<div class="size-pill" data-size="${s}">${s}</div>`
  ).join("");

  container.innerHTML = `
    <!-- Gallery -->
    <div class="product-gallery reveal-left">
      <div class="gallery-main">
        ${imageHTML}
        ${product.badge ? `<div class="gallery-badge ${badgeClass}">${badgeText}</div>` : ""}
      </div>
    </div>

    <!-- Details -->
    <div class="product-details reveal-right">
      <div class="product-breadcrumb">
        <a href="shop.html">Shop</a>
        <span>/</span>
        <a href="shop.html?cat=${product.category}">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</a>
        <span>/</span>
        ${product.name}
      </div>

      <h1 class="product-details-name">${product.name}</h1>

      <div class="product-details-price-row">
        <span class="product-details-price">₹${product.price.toLocaleString("en-IN")}</span>
        ${originalPriceHTML}
      </div>

      <p class="product-details-desc">
        Premium quality streetwear, crafted for the everyday hustle.
        Raw textures, precise cuts, and a silhouette that speaks before you do.
        This piece is part of the VŌLT SS '25 Drop.
      </p>

      <div class="size-label">
        Select Size
        <a href="#">Size Guide</a>
      </div>
      <div class="size-grid" id="sizeGrid">
        ${sizePills}
      </div>

      <button class="add-to-bag-btn no-size-selected" id="addToBagBtn">
        Select a size first
      </button>

      <div class="product-perks">
        <div class="perk-row"><span class="perk-icon">🚚</span> Free delivery on orders above ₹999</div>
        <div class="perk-row"><span class="perk-icon">↩️</span> Easy 7-day returns</div>
        <div class="perk-row"><span class="perk-icon">🔒</span> Secure payment via Razorpay</div>
        <div class="perk-row"><span class="perk-icon">🇮🇳</span> Made &amp; shipped from India</div>
      </div>

      <div class="product-meta-tags">
        <span class="meta-tag">${product.category}</span>
        <span class="meta-tag">SS '25</span>
        <span class="meta-tag">Free Return</span>
        ${product.badge ? `<span class="meta-tag">${product.badge}</span>` : ""}
      </div>
    </div>
  `;

  // Trigger reveal animations
  setTimeout(() => {
    container.querySelectorAll(".reveal-left, .reveal-right").forEach(el => el.classList.add("revealed"));
  }, 80);

  // Size selection
  let selectedSize = null;
  const addBtn = document.getElementById("addToBagBtn");
  document.getElementById("sizeGrid")?.querySelectorAll(".size-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".size-pill").forEach(p => p.classList.remove("selected"));
      pill.classList.add("selected");
      selectedSize = pill.dataset.size;
      addBtn.textContent = `Add to Bag — ${selectedSize}`;
      addBtn.classList.remove("no-size-selected");
    });
  });

  addBtn?.addEventListener("click", () => {
    if (!selectedSize) {
      showToast("Please select a size first!");
      return;
    }
    addToCart(product, selectedSize);
  });
});
