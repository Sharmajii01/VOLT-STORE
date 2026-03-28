// ===== MAIN.JS =====

document.addEventListener("DOMContentLoaded", () => {

  // ── 1. Custom cursor dot ──────────────────────────────────────────────
  document.addEventListener("mousemove", (e) => {
    document.body.style.setProperty("--cx", e.clientX + "px");
    document.body.style.setProperty("--cy", e.clientY + "px");
  });

  // ── 2. Navbar scroll effect ───────────────────────────────────────────
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });

  // ── 3. Hamburger / mobile menu ────────────────────────────────────────
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu?.classList.toggle("open");
  });
  // Close on link click
  mobileMenu?.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      hamburger?.classList.remove("open");
      mobileMenu.classList.remove("open");
    })
  );

  // ── 4. Scroll reveal (IntersectionObserver) ───────────────────────────
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach(el => observer.observe(el));

  // ── 5. Hero elements reveal on load ──────────────────────────────────
  setTimeout(() => {
    document.querySelectorAll(".hero .reveal-up, .hero .reveal-left, .hero .reveal-right")
      .forEach(el => el.classList.add("revealed"));
  }, 100);

  // ── 6. Render featured products ───────────────────────────────────────
  const grid = document.getElementById("productsGrid");
  if (grid && typeof PRODUCTS !== "undefined") {
    const featured = PRODUCTS.filter(p => p.featured).slice(0, 8);
    featured.forEach(product => {
      const card = buildProductCard(product);
      grid.appendChild(card);
    });
    // Observe newly added cards
    grid.querySelectorAll(".reveal-up").forEach(el => observer.observe(el));
  }

  // ── 7. Smooth anchor scroll ───────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ── 8. Page leave transition ──────────────────────────────────────────
  const overlay = document.createElement("div");
  overlay.className = "page-transition";
  document.body.appendChild(overlay);

  // Animate in on load
  overlay.classList.add("leaving");
  setTimeout(() => overlay.classList.remove("leaving"), 600);

  // Animate out on internal navigation
  document.querySelectorAll("a:not([href^='#']):not([target='_blank'])").forEach(a => {
    if (!a.href || a.href === window.location.href) return;
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("mailto")) return;
      e.preventDefault();
      overlay.classList.add("entering");
      setTimeout(() => window.location.href = href, 480);
    });
  });

});
