import { updateCompareButton } from './compare.js';
import { updateCartDisplay } from './cart.js';

export function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if (id === 'catalog') {
    window.currentPage = 1;
    displayPage(window.currentPage);
    populateCategoryFilter();
    document.getElementById('search').value = '';
    document.getElementById('priceFrom').value = '';
    document.getElementById('priceTo').value = '';
  }

  // Видалено виклик loadProfile, оскільки він перенесений у index.js
}

export function populateCategoryFilter() {
  const categories = [...new Set(window.originalProducts.map(item => item.fields.category))];
  const categorySelect = document.getElementById('category');
  categorySelect.innerHTML = '<option value="">Усі категорії</option>' +
    categories.map(category => `<option value="${category}">${category}</option>`).join('');
}

export function filterByCategory() {
  filterByPrice();
}

export function filterByPrice() {
  const minPrice = parseFloat(document.getElementById('priceFrom').value) || 0;
  const maxPrice = parseFloat(document.getElementById('priceTo').value) || Infinity;
  const category = document.getElementById('category').value;
  const searchInput = document.getElementById('search').value.trim().toLowerCase();

  window.filteredProducts = window.originalProducts.filter(item => {
    const matchesCategory = category ? item.fields.category === category : true;
    const matchesSearch = searchInput ? item.fields.title.toLowerCase().includes(searchInput) : true;
    const matchesPrice = item.fields.price >= minPrice && item.fields.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  window.currentPage = 1;
  displayPage(window.currentPage);
}

export function sortProducts(order) {
  window.filteredProducts.sort((a, b) => 
    order === 'asc' ? a.fields.price - b.fields.price : b.fields.price - a.fields.price
  );
  window.currentPage = 1;
  displayPage(window.currentPage);
}

export function displayPage(page) {
  window.currentPage = page;
  const start = (page - 1) * window.itemsPerPage;
  const end = start + window.itemsPerPage;
  const paginatedItems = window.filteredProducts.slice(start, end);
  const productList = document.getElementById('productsList');
  productList.innerHTML = paginatedItems.length > 0 ? paginatedItems.map(item => `
    <div class="product-item">
      <h3 onclick="showProductDetails('${item.sys.id}')">${item.fields.title}</h3>
      <img src="${item.fields.image.fields.file.url}" alt="${item.fields.title}" loading="lazy" onerror="this.src='https://placehold.co/150';">
      <p>Ціна: ${item.fields.price} грн</p>
      <label><input type="checkbox" class="compare-checkbox" data-id="${item.sys.id}" onchange="toggleCompare(this)"> Порівняти</label>
      <button class="add-to-cart" data-id="${item.sys.id}">Додати в кошик</button>
    </div>
  `).join('') : '<p style="text-align: center; color: #7f8c8d;">Нічого не знайдено</p>';
  addProductButtonListeners();
  updatePaginationControls();
  updateCompareButton();
}

export function updatePaginationControls() {
  const totalPages = Math.ceil(window.filteredProducts.length / window.itemsPerPage);
  document.getElementById('pagination').innerHTML = `
    <button id="prevPage" ${window.currentPage === 1 ? 'disabled' : ''}>Попередня</button>
    <span>Сторінка ${window.currentPage} з ${totalPages || 1}</span>
    <button id="nextPage" ${window.currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}>Наступна</button>
  `;
}

export function previousPage() {
  if (window.currentPage > 1) {
    displayPage(window.currentPage - 1);
  }
}

export function nextPage() {
  const totalPages = Math.ceil(window.filteredProducts.length / window.itemsPerPage);
  if (window.currentPage < totalPages) {
    displayPage(window.currentPage + 1);
  }
}

export async function loadProducts() {
  try {
    console.log('Fetching products from http://localhost:5000/api/products...');
    const response = await fetch('http://localhost:5000/api/products');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const products = await response.json();
    window.originalProducts = products.map(product => ({
      sys: { id: product._id },
      fields: {
        title: product.title,
        price: product.price,
        category: product.category,
        description: product.description,
        image: { fields: { file: { url: product.image } } }
      }
    }));
    window.filteredProducts = [...window.originalProducts];
    console.log('Products loaded:', window.originalProducts.length);
    displayPage(1);
    populateCategoryFilter();
  } catch (error) {
    console.error('Error loading products:', error);
    const productList = document.getElementById('productsList');
    productList.innerHTML = '<p style="text-align: center; color: #e74c3c;">Помилка завантаження продуктів</p>';
  }
}

export function handleSearch(event) {
  if (event.key === 'Enter') {
    filterByPrice();
  }
}

export function searchProducts() {
  filterByPrice();
}

export function addProductButtonListeners() {
  const buttons = document.querySelectorAll('.add-to-cart');
  buttons.forEach(button => {
    button.removeEventListener('click', handleAddToCart);
    button.addEventListener('click', handleAddToCart);
  });
}

function handleAddToCart(event) {
  const productId = event.target.dataset.id;
  const product = window.originalProducts.find(item => item.sys.id === productId);
  window.cartItems.push({ name: product.fields.title, price: product.fields.price });
  updateCartDisplay();

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = `${product.fields.title} додано до кошика!`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}

export function addToCart(productId) {
  const product = window.originalProducts.find(item => item.sys.id === productId);
  window.cartItems.push({ name: product.fields.title, price: product.fields.price });
  updateCartDisplay();

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = `${product.fields.title} додано до кошика!`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}