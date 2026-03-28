// ===== PRODUCTS DATA =====
// Replace image URLs with your actual product images.
// You can use any image hosting (Cloudinary, Firebase, etc.)
// For now, we use placeholder gradient backgrounds.

const PRODUCTS = [
  {
    id: 1,
    name: "Cargo Wide-Leg",
    category: "men",
    price: 2499,
    originalPrice: 3499,
    badge: "sale",
    sizes: ["S","M","L","XL","XXL"],
    image: null, // Replace with: "images/cargo-wide-leg.jpg"
    placeholder: "CARGO",
    bgColor: "#1f1f1f",
    featured: true,
  },
  {
    id: 2,
    name: "Oversized Drop Tee",
    category: "men",
    price: 999,
    originalPrice: null,
    badge: "new",
    sizes: ["S","M","L","XL","XXL"],
    image: null,
    placeholder: "TEE",
    bgColor: "#1a1a1a",
    featured: true,
  },
  {
    id: 3,
    name: "Co-ord Set – Sand",
    category: "women",
    price: 3199,
    originalPrice: null,
    badge: "hot",
    sizes: ["XS","S","M","L","XL"],
    image: null,
    placeholder: "CO-ORD",
    bgColor: "#222018",
    featured: true,
  },
  {
    id: 4,
    name: "Drape Kurta",
    category: "women",
    price: 1799,
    originalPrice: 2199,
    badge: "sale",
    sizes: ["XS","S","M","L"],
    image: null,
    placeholder: "KURTA",
    bgColor: "#1c1a1a",
    featured: true,
  },
  {
    id: 5,
    name: "Everyday Hoodie",
    category: "essentials",
    price: 1699,
    originalPrice: null,
    badge: "new",
    sizes: ["S","M","L","XL","XXL"],
    image: null,
    placeholder: "HOOD",
    bgColor: "#181818",
    featured: true,
  },
  {
    id: 6,
    name: "Slim Track Pant",
    category: "men",
    price: 1299,
    originalPrice: null,
    badge: null,
    sizes: ["S","M","L","XL"],
    image: null,
    placeholder: "TRACK",
    bgColor: "#1d1d1d",
    featured: true,
  },
  {
    id: 7,
    name: "Ribbed Crop Top",
    category: "women",
    price: 799,
    originalPrice: null,
    badge: "hot",
    sizes: ["XS","S","M","L"],
    image: null,
    placeholder: "CROP",
    bgColor: "#1a1c1a",
    featured: true,
  },
  {
    id: 8,
    name: "Classic White Tee",
    category: "essentials",
    price: 699,
    originalPrice: null,
    badge: null,
    sizes: ["S","M","L","XL","XXL"],
    image: null,
    placeholder: "WHITE",
    bgColor: "#202020",
    featured: true,
  },
];

// Helper
function formatINR(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Build a product card element
function buildProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card reveal-up";
  card.dataset.id = product.id;

  const badgeHTML = product.badge
    ? `<div class="product-badge badge-${product.badge}">${product.badge === "hot" ? "🔥 Hot" : product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}</div>`
    : "";

  const imageHTML = product.image
    ? `<img src="${product.image}" alt="${product.name}" loading="lazy" />`
    : `<div class="product-image-placeholder" style="background:${product.bgColor}">${product.placeholder}</div>`;

  const originalPriceHTML = product.originalPrice
    ? `<span class="product-original-price">${formatINR(product.originalPrice)}</span>`
    : "";

  card.innerHTML = `
    <div class="product-image-wrap">
      ${imageHTML}
      ${badgeHTML}
      <div class="product-quick-add" data-id="${product.id}">+ Add to Bag</div>
    </div>
    <div class="product-info">
      <div class="product-name">${product.name}</div>
      <div class="product-meta">
        <div>
          <span class="product-price">${formatINR(product.price)}</span>
          ${originalPriceHTML}
        </div>
        <span class="product-category">${product.category}</span>
      </div>
    </div>
  `;

  // Quick add
  card.querySelector(".product-quick-add").addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product);
  });

  // Click to product page
  card.addEventListener("click", () => {
    window.location.href = `product.html?id=${product.id}`;
  });

  return card;
}
