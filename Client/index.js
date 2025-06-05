import { showSection, loadProducts, displayPage, updatePaginationControls, populateCategoryFilter, filterByCategory, filterByPrice, sortProducts, handleSearch, searchProducts, addToCart } from './catalog.js';
import { updateCartDisplay, removeFromCart, removeSelectedItems, clearCart, toggleCartPopup, showCheckout, submitOrder } from './cart.js';
import { registerUser, loginUser, resetPassword, logoutUser, updateAuthStatus, loadProfile, saveProfile, handleAvatarUpload } from './auth.js';
import { updateCompareButton, toggleCompare, showComparePage, removeFromCompare, showProductDetails } from './compare.js';
import { toggleTheme } from './utils.js';
import fs from 'fs'; // Для роботи з файлами (потрібно додати у Node.js)
import path from 'path';

// Глобальні змінні
window.cartItems = [];
window.originalProducts = [];
window.filteredProducts = [];
window.compareItems = [];
window.currentUser = null;
window.currentPage = 1;
window.itemsPerPage = 6;

// Масив для зберігання користувачів
let users = []; // Ініціалізація масиву користувачів

// Функція для завантаження користувачів із файлу
const loadUsers = () => {
  const usersFilePath = path.join(__dirname, 'users.json');
  if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath);
    users = JSON.parse(data);
  }
};

// Функція для збереження користувачів у файл
const saveUserData = () => {
  const usersFilePath = path.join(__dirname, 'users.json');
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Ініціалізація
document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log('Initializing application...');

    // Налаштування теми
    const savedTheme = localStorage.getItem('theme');
    const themeSwitch = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('themeLabel');
    if (savedTheme === 'dark' && themeSwitch && themeLabel) {
      themeSwitch.checked = true;
      document.body.classList.add('dark-theme');
      themeLabel.textContent = 'Світла тема';
    }

    // Налаштування користувача
    window.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    loadUsers(); // Завантажуємо користувачів із файлу
    // Відкладений виклик updateAuthStatus після завантаження DOM
    setTimeout(() => {
      console.log('Updating auth status...');
      updateAuthStatus();
    }, 0);

    // Завантаження продуктів лише якщо є елемент #productsList (наприклад, на index.html)
    const productsList = document.getElementById('productsList');
    if (productsList) {
      await loadProducts();
      if (window.originalProducts.length > 0) {
        window.filteredProducts = [...window.originalProducts];
        // Перевіряємо, чи є збережена секція для відображення
        const sectionToShow = localStorage.getItem('sectionToShow') || 'catalog';
        showSection(sectionToShow);
        localStorage.removeItem('sectionToShow'); // Очищаємо після використання
      } else {
        console.error('Не вдалося завантажити продукти. Перевірте /api/products.');
        productsList.innerHTML = '<p style="text-align: center; color: #e74c3c;">Помилка завантаження продуктів</p>';
      }
    }

    // Прив’язка обробників подій
    bindEventListeners();
  } catch (error) {
    console.error('Помилка ініціалізації:', error);
    const productsList = document.getElementById('productsList');
    if (productsList) {
      productsList.innerHTML = '<p style="text-align: center; color: #e74c3c;">Критична помилка ініціалізації</p>';
    }
  }
});

// Функція для прив’язки обробників подій
function bindEventListeners() {
  console.log('Binding event listeners...');

  // Кнопки навігації
  document.getElementById('navCatalog')?.addEventListener('click', () => {
    if (window.location.pathname.includes('index.html') || !window.location.pathname.includes('compare.html')) {
      showSection('catalog');
    } else {
      localStorage.setItem('sectionToShow', 'catalog');
      window.location.href = 'index.html';
    }
  });
  document.getElementById('navCart')?.addEventListener('click', () => {
    if (window.location.pathname.includes('index.html') || !window.location.pathname.includes('compare.html')) {
      showSection('cart');
    } else {
      localStorage.setItem('sectionToShow', 'cart');
      window.location.href = 'index.html';
    }
  });
  document.getElementById('navCompare')?.addEventListener('click', () => {
    if (window.location.pathname.includes('compare.html')) {
      // Ми вже на сторінці порівняння, нічого не робимо
      return;
    } else {
      showComparePage();
    }
  });
  document.getElementById('navProfile')?.addEventListener('click', () => {
    if (window.location.pathname.includes('index.html') || !window.location.pathname.includes('compare.html')) {
      showSection('profile');
      if (window.currentUser) loadProfile();
    } else {
      localStorage.setItem('sectionToShow', 'profile');
      window.location.href = 'index.html';
    }
  });

  // Аутентифікація
  document.getElementById('registerBtn')?.addEventListener('click', () => showSection('register'));
  document.getElementById('loginBtn')?.addEventListener('click', () => showSection('login'));
  document.getElementById('avatarButton')?.addEventListener('click', () => {
    showSection('profile');
    if (window.currentUser) loadProfile();
  });

  // Тема
  const themeSwitch = document.getElementById('theme-toggle');
  const switchSlider = document.querySelector('.switch-slider');
  if (themeSwitch) {
    themeSwitch.addEventListener('change', toggleTheme);
  }
  if (switchSlider) {
    switchSlider.addEventListener('click', () => {
      const themeSwitch = document.getElementById('theme-toggle');
      if (themeSwitch) {
        themeSwitch.checked = !themeSwitch.checked;
        toggleTheme();
      }
    });
  }

  // Пошук
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', searchProducts);
    searchInput.addEventListener('keypress', handleSearch);
  }

  // Фільтри
  document.getElementById('category')?.addEventListener('change', filterByCategory);
  document.getElementById('priceFrom')?.addEventListener('input', filterByPrice);
  document.getElementById('priceTo')?.addEventListener('input', filterByPrice);

  // Сортування
  document.getElementById('sortAsc')?.addEventListener('click', () => sortProducts('asc'));
  document.getElementById('sortDesc')?.addEventListener('click', () => sortProducts('desc'));

  // Порівняння
  document.getElementById('compareButton')?.addEventListener('click', showComparePage);

  // Пагінація
  document.getElementById('prevPage')?.addEventListener('click', () => {
    if (window.currentPage > 1) displayPage(window.currentPage - 1);
  });
  document.getElementById('nextPage')?.addEventListener('click', () => {
    const totalPages = Math.ceil(window.filteredProducts.length / window.itemsPerPage);
    if (window.currentPage < totalPages) displayPage(window.currentPage + 1);
  });

  // Кошик
  document.getElementById('cartCount')?.addEventListener('click', toggleCartPopup);
  document.getElementById('checkoutBtn')?.addEventListener('click', showCheckout);
  document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
  document.getElementById('removeSelectedBtn')?.addEventListener('click', removeSelectedItems);

  // Оформлення замовлення
  document.getElementById('submitOrderBtn')?.addEventListener('click', submitOrder);
  document.getElementById('backToCartBtn')?.addEventListener('click', () => showSection('cart'));

  // Повернення до каталогу
  document.getElementById('backToCatalogBtn')?.addEventListener('click', () => {
    if (window.location.pathname.includes('compare.html')) {
      localStorage.setItem('sectionToShow', 'catalog');
      window.location.href = 'index.html';
    } else {
      showSection('catalog');
    }
  });
  document.getElementById('backToCatalogFromDetailsBtn')?.addEventListener('click', () => showSection('catalog'));

  // Форми
  document.getElementById('registerSubmitBtn')?.addEventListener('click', registerUser);
  document.getElementById('loginSubmitBtn')?.addEventListener('click', loginUser);
  document.getElementById('resetPasswordBtn')?.addEventListener('click', resetPassword);
  document.getElementById('saveProfileBtn')?.addEventListener('click', saveProfile);
  document.getElementById('logoutBtn')?.addEventListener('click', logoutUser);
  document.getElementById('profileAvatar')?.addEventListener('change', handleAvatarUpload);

  // Динамічне прив’язання обробників для чекбоксів порівняння
  const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
  compareCheckboxes.forEach(checkbox => {
    checkbox.removeEventListener('change', toggleCompare);
    checkbox.addEventListener('change', (event) => toggleCompare(event.target));
  });
}

// Додавання обробки PUT-запиту для оновлення профілю
app.put('/api/auth/update', (req, res) => {
  const { name, email } = req.body;
  const token = req.headers.authorization?.split(' ')[1]; // Отримуємо токен із заголовка

  if (!token) {
    return res.status(401).json({ message: 'Токен авторизації відсутній' });
  }

  // Пошук користувача за токеном
  const user = users.find(u => u.token === token);
  if (!user) {
    return res.status(401).json({ message: 'Невалідний токен' });
  }

  // Оновлення даних користувача
  user.name = name || user.name;
  user.email = email || user.email;

  // Збереження оновлених даних
  saveUserData();

  res.json({ name: user.name, email: user.email, token: user.token });
});