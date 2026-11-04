// Minimal app.js to render products and wire controls (static frontend)

const SAMPLE_PRODUCTS = [
  { id: 'vd-001', name: 'Infinity Backpack', price: 2499, category: 'Bags', description: 'Sleek, weather-resistant backpack built for daily carry.', image: 'assets/products/vd-001.jpg' },
  { id: 'vd-002', name: 'Handheld Fan', price: 1999, category: 'Accessories', description: 'True wireless earbuds with balanced sound.', image: 'assets/products/vd-002.jpg' },
  { id: 'vd-003', name: 'Anti Theft Bag', price: 799, category: 'Bags', description: 'Double-wall stainless steel flask keeps drinks hot or cold for hours.', image: 'assets/products/vd-003.jpg' },
  { id: 'vd-004', name: 'Ufo Drone Toy', price: 1199, category: 'Fashion', description: 'Classic shape, modern finish — easy to pair.', image: 'assets/products/vd-004.jpg' },
  { id: 'vd-005', name: 'Kitten Bag', price: 499, category: 'Bags', description: 'Slim TPU case with matte finish and anti-yellowing formula.', image: 'assets/products/vd-005.jpg' },
  { id: 'vd-006', name: 'Posture Corrector', price: 1299, category: 'Home', description: 'Wood-texture organizer with slots for phone and cables.', image: 'assets/products/vd-006.jpg' }
];

function init() {
  populateCategoryFilter();
  renderProducts(SAMPLE_PRODUCTS);
  document.getElementById('filter-category').addEventListener('change', applyFilters);
  document.getElementById('sort-order').addEventListener('change', applyFilters);

  // animations
  document.querySelectorAll('.fade-in').forEach(el => el.classList.add('is-visible'));

  // navbar toggle setup
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".menu-toggle");

  function checkOverflow() {
    const navWidth = nav.scrollWidth;
    const containerWidth = nav.parentElement.offsetWidth;
    if (navWidth > containerWidth) {
      toggle.style.display = "block";
      nav.classList.remove("show");
    } else {
      toggle.style.display = "none";
      nav.classList.remove("show");
    }
  }

  toggle.addEventListener("click", () => nav.classList.toggle("show"));
  window.addEventListener("resize", checkOverflow);
  checkOverflow();
}

function populateCategoryFilter() {
  const sel = document.getElementById('filter-category');
  const cats = ['All', ...new Set(SAMPLE_PRODUCTS.map(p => p.category))];
  sel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
}

function applyFilters() {
  const cat = document.getElementById('filter-category').value;
  const sort = document.getElementById('sort-order').value;
  let items = SAMPLE_PRODUCTS.slice();
  if (cat && cat !== 'All') items = items.filter(p => p.category === cat);
  if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
  renderProducts(items);
}

function renderProducts(products) {
  const grid = document.getElementById('products');
  grid.innerHTML = products.map(p => `
    <article class="product-card fade-in">
      <div class="product-media"><img src="${p.image}" alt="${p.name}"></div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="price">₹${p.price.toFixed(2)}</div>
        <div class="category small muted">${p.category}</div>
        <div class="desc">${p.description}</div>
        <div class="actions">
          <a class="btn small ghost" href="product.html?id=${encodeURIComponent(p.id)}">View</a>
          <button class="btn small primary" onclick="addToCart('${p.id}')">Add</button>
        </div>
      </div>
    </article>
  `).join('');
}

function addToCart(id) {
  const product = SAMPLE_PRODUCTS.find(p => p.id === id);
  if (!product) return;

  let cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  alert(`Added ${product.name} to cart.`);
  updateCartCount();
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  document.getElementById('cart-count').textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

// ---- CART PAGE RENDER ----
function renderCartPage() {
  const cartContainer = document.getElementById('cart-items');
  if (!cartContainer) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById('cart-total').textContent = "0";
    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name}</span>
      <span>₹${item.price} × ${item.qty}</span>
    </div>
  `).join('');

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById('cart-total').textContent = total;

  // Stripe Checkout Button
  const payBtn = document.getElementById('checkout-btn');
  if (payBtn) {
    payBtn.onclick = async () => {
      const stripe = Stripe("pk_test_XXXXXXXXXXXXXXXXXXXX"); // ⚡ your publishable key

      const response = await fetch("/createCheckoutSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const session = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      if (result.error) alert(result.error.message);
    };
  }
}

window.addEventListener('DOMContentLoaded', () => {
  init();
  renderCartPage();
  updateCartCount();
});
