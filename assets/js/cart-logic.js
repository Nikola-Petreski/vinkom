// Cart management functions - used across all pages

function loadCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCart() {
  saveCart([]);
  updateCartBadge();
}

function formatPrice(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ден.';
}

function showTooltip(target, message) {
  const existing = document.getElementById('custom-tooltip');
  if (existing) existing.remove();
  const tooltip = document.createElement('div');
  tooltip.id = 'custom-tooltip';
  tooltip.textContent = message;
  tooltip.style.position = 'fixed';
  tooltip.style.zIndex = '9999';
  tooltip.style.background = 'rgba(0,0,0,0.88)';
  tooltip.style.color = '#fff';
  tooltip.style.padding = '0.5rem 0.75rem';
  tooltip.style.borderRadius = '9999px';
  tooltip.style.fontSize = '0.85rem';
  tooltip.style.lineHeight = '1.2';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.opacity = '0';
  tooltip.style.transition = 'opacity 0.2s ease';
  tooltip.style.maxWidth = 'calc(100vw - 32px)';
  tooltip.style.wordBreak = 'break-word';
  document.body.appendChild(tooltip);
  const rect = target.getBoundingClientRect();
  const left = Math.min(window.innerWidth - tooltip.offsetWidth - 8, Math.max(8, rect.left + rect.width / 2 - tooltip.offsetWidth / 2));
  let top = rect.top - tooltip.offsetHeight - 8;
  if (top < 8) top = rect.bottom + 8;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  requestAnimationFrame(() => tooltip.style.opacity = '1');
  setTimeout(() => {
    tooltip.style.opacity = '0';
    setTimeout(() => tooltip.remove(), 200);
  }, 2000);
}

function updateCartBadge() {
  const cart = loadCart();
  let totalQty = 0;
  cart.forEach(item => {
    totalQty += (item.qty || 1);
  });
  const badge = document.getElementById('cartBadge');
  if (badge) {
    if (totalQty === 0) {
      badge.style.display = "none";
    } else {
      badge.style.display = "inline-flex";
      badge.textContent = totalQty >= 100 ? "99+" : totalQty.toString();
    }
  }
}

let cartAddedMessageTimer;
let cartAddedMessageRestoreTimer;

function showCartAddedMessage() {
  const message = document.getElementById('cartAddedMessage');
  const label = document.getElementById('cartLabel');
  if (!message) return;

  clearTimeout(cartAddedMessageTimer);
  clearTimeout(cartAddedMessageRestoreTimer);
  if (label) label.style.display = 'none';
  message.classList.remove('max-w-0', 'opacity-0');
  message.classList.add('max-w-xs', 'opacity-100');
  cartAddedMessageTimer = setTimeout(() => {
    message.classList.remove('max-w-xs', 'opacity-100');
    message.classList.add('max-w-0', 'opacity-0');
    cartAddedMessageRestoreTimer = setTimeout(() => {
      if (label) label.style.display = '';
    }, 300);
  }, 3000);
}

function addProductToCart(product) {
  const cart = loadCart();
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.qty = Math.min(99, (existing.qty || 1) + 1);
  } else {
    if (cart.length >= 10) {
      return false;
    }
    cart.push({ id: Date.now(), productId: product.productId, name: product.name, price: product.price, qty: 1, image: product.image });
  }
  saveCart(cart);
  updateCartBadge();
  showCartAddedMessage();
  return true;
}

function removeProductFromCart(index) {
  const cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartBadge();
}

function updateProductQuantity(index, quantity) {
  const cart = loadCart();
  if (cart[index]) {
    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity < 1) quantity = 1;
    if (quantity > 99) quantity = 99;
    cart[index].qty = quantity;
    saveCart(cart);
    updateCartBadge();
  }
}

// Update cart when localStorage changes from other pages/tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'cart') {
    updateCartBadge();
  }
});

function initializeCart() {
  updateCartBadge();

  const addButton = document.getElementById('modalAddToCart');
  if (!addButton || addButton.dataset.cartInitialized === 'true') return;
  addButton.dataset.cartInitialized = 'true';

  addButton.addEventListener('click', function(event) {
    event.preventDefault();

    const nameElement = document.getElementById('modal-title');
    const priceElement = document.getElementById('modal-price');
    const imageElement = document.getElementById('modal-img');
    if (!nameElement || !priceElement) return;

    const priceMatches = priceElement.textContent.match(/\d[\d.]*/g) || [];
    const price = parseInt((priceMatches.at(-1) || '0').replace(/\./g, ''), 10) || 0;
    addProductToCart({
      productId: window.currentModalProduct ? window.currentModalProduct.id : undefined,
      name: nameElement.textContent.trim(),
      price,
      image: imageElement ? imageElement.src : ''
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCart);
} else {
  initializeCart();
}
