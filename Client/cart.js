import { showSection } from './catalog.js';

export function updateCartDisplay() {
  const cartCount = document.getElementById('cartCount');
  const totalPrice = window.cartItems.reduce((sum, item) => sum + item.price, 0);
  cartCount.textContent = window.cartItems.length;

  const cartItemsList = document.getElementById('cartItems');
  const cartPopupItems = document.getElementById('cartPopupItems');
  
  const itemsHtml = window.cartItems.map((item, index) => `
    <li>
      <input type="checkbox" class="cart-item-checkbox" data-index="${index}">
      ${item.name} (${item.price.toFixed(2)} грн)
      <button class="remove-from-cart" data-index="${index}">Видалити</button>
    </li>
  `).join('');

  cartItemsList.innerHTML = itemsHtml || '<p>Кошик порожній</p>';
  if (cartPopupItems) {
    cartPopupItems.innerHTML = itemsHtml || '<p>Кошик порожній</p>';
  }

  const removeButtons = document.querySelectorAll('.remove-from-cart');
  removeButtons.forEach(button => {
    button.removeEventListener('click', handleRemoveFromCart);
    button.addEventListener('click', handleRemoveFromCart);
  });
}

function handleRemoveFromCart(event) {
  const index = parseInt(event.target.dataset.index);
  removeFromCart(index);
}

export function removeFromCart(index) {
  window.cartItems.splice(index, 1);
  updateCartDisplay();
}

export function removeSelectedItems() {
  const checkboxes = document.querySelectorAll('.cart-item-checkbox:checked');
  const indices = Array.from(checkboxes).map(checkbox => parseInt(checkbox.dataset.index)).sort((a, b) => b - a);
  indices.forEach(index => window.cartItems.splice(index, 1));
  updateCartDisplay();
}

export function clearCart() {
  window.cartItems = [];
  updateCartDisplay();
}

export function toggleCartPopup() {
  const cartPopup = document.getElementById('cartPopup');
  cartPopup.style.display = cartPopup.style.display === 'block' ? 'none' : 'block';
  updateCartDisplay();
}

export function showCheckout() {
  if (window.cartItems.length === 0) {
    alert('Ваш кошик порожній!');
    return;
  }
  showSection('checkout');
  const totalPrice = window.cartItems.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('checkoutSummary').innerHTML = `Загальна сума: ${totalPrice.toFixed(2)} грн`;
  if (window.currentUser) {
    document.getElementById('checkoutName').value = window.currentUser.name || '';
    document.getElementById('checkoutPhone').value = window.currentUser.phone || '';
  }
}

export async function submitOrder() {
  const name = document.getElementById('checkoutName').value.trim();
  const address = document.getElementById('checkoutAddress').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();

  if (!name || !address || !phone) {
    alert('Будь ласка, заповніть усі поля!');
    return;
  }

  if (!/^\+?\d{10,15}$/.test(phone)) {
    alert('Введіть коректний номер телефону!');
    return;
  }

  const order = {
    user: name,
    address,
    phone,
    items: window.cartItems,
    total: window.cartItems.reduce((sum, item) => sum + item.price, 0)
  };

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(order)
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    window.cartItems = [];
    updateCartDisplay();
    document.getElementById('checkoutSummary').innerHTML = 'Замовлення успішно оформлено!';
    setTimeout(() => showSection('cart'), 2000);
  } catch (err) {
    alert('Помилка оформлення замовлення');
  }
}