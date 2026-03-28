// ===== SHOP PAGE JS =====
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("shopGrid");
  const noResults = document.getElementById("noResults");
  const filterTabs = document.querySelectorAll(".filter-tab");
  const sortSelect = document.getElementById("sortSelect");

  // Read ?cat= from URL
  const urlCat = new URLSearchParams(window.location.search).get("cat") || "all";
  let currentCat = urlCat;
  let currentSort = "default";

  // Set active tab from URL
  filterTabs.forEach(btn => {
    if (btn.dataset.cat === urlCat) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  function renderProducts() {
    grid.innerHTML = "";
    grid.classList.add("filtering");

    let items = currentCat === "all"
      ? [...PRODUCTS]
      : PRODUCTS.filter(p => p.category === currentCat);

    if (currentSort === "price-asc") items.sort((a,b) => a.price - b.price);
    if (currentSort === "price-desc") items.sort((a,b) => b.price - a.price);

    noResults.style.display = items.length === 0 ? "block" : "none";

    items.forEach((product, i) => {
      const card = buildProductCard(product);
      card.style.animationDelay = `${i * 40}ms`;
      grid.appendChild(card);
    });

    setTimeout(() => grid.classList.remove("filtering"), 400);
  }

  filterTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      filterTabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCat = btn.dataset.cat;
      renderProducts();
      // Update URL without reload
      const url = new URL(window.location);
      currentCat === "all" ? url.searchParams.delete("cat") : url.searchParams.set("cat", currentCat);
      history.replaceState({}, "", url);
    });
  });

  sortSelect?.addEventListener("change", () => {
    currentSort = sortSelect.value;
    renderProducts();
  });

  renderProducts();
});
