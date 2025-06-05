export function updateCompareButton() {
  const compareButton = document.getElementById('compareButton');
  if (!compareButton) return; // Захист від відсутності елемента
  if (window.compareItems.length > 0) {
    compareButton.style.display = 'block';
    compareButton.textContent = `Порівняти (${window.compareItems.length})`;
  } else {
    compareButton.style.display = 'none';
  }
}

export function toggleCompare(checkbox) {
  const productId = checkbox.dataset.id;
  if (checkbox.checked) {
    const product = window.originalProducts?.find(item => item.sys.id === productId);
    if (!product) {
      console.error(`Продукт із ID ${productId} не знайдено в originalProducts`);
      checkbox.checked = false;
      return;
    }
    if (window.compareItems.length < 4) {
      window.compareItems.push(product);
    } else {
      checkbox.checked = false;
      alert('Можна порівняти не більше 4 товарів!');
    }
  } else {
    window.compareItems = window.compareItems.filter(item => item.sys.id !== productId);
  }
  updateCompareButton();
}

export function showComparePage() {
  if (window.compareItems.length === 0) {
    alert('Виберіть товари для порівняння!');
    return;
  }
  // Зберігаємо товари для порівняння та originalProducts в localStorage
  localStorage.setItem('compareItems', JSON.stringify(window.compareItems));
  localStorage.setItem('originalProducts', JSON.stringify(window.originalProducts));
  // Перенаправлення на сторінку порівняння
  window.location.href = 'compare.html';
}

export function removeFromCompare(id) {
  window.compareItems = window.compareItems.filter(item => item.sys.id !== id);
  const checkboxes = document.querySelectorAll(`.compare-checkbox[data-id="${id}"]`);
  checkboxes.forEach(checkbox => (checkbox.checked = false));
  updateCompareButton();
  if (window.compareItems.length === 0) {
    // Тут можна додати логіку повернення до каталогу, якщо потрібно
    // showSection('catalog');
  }
}

export function showProductDetails(id) {
  const product = window.originalProducts.find(item => item.sys.id === id);
  if (!product) {
    console.error(`Продукт із ID ${id} не знайдено`);
    showSection('catalog');
    return;
  }
  showSection('product-details');
  const productDetailContent = document.getElementById('productDetailContent');
  const compareSelection = document.getElementById('compareSelection');
  const recommendations = document.getElementById('recommendations');

  productDetailContent.innerHTML = `
    <h2>${product.fields.title}</h2>
    <img src="${product.fields.image.fields.file.url}" alt="${product.fields.title}" style="max-width: 300px;" loading="lazy">
    <p>Ціна: ${product.fields.price} грн</p>
    <p>Опис: ${product.fields.description || 'Немає опису'}</p>
  `;

  const sameCategoryProducts = window.originalProducts.filter(p => p.sys.id !== id && p.fields.category === product.fields.category);
  compareSelection.innerHTML = `
    <h3>Виберіть для порівняння:</h3>
    ${sameCategoryProducts.map(p => `
      <div>
        <input type="checkbox" class="compare-checkbox" data-id="${p.sys.id}">
        <label>${p.fields.title} (${p.fields.price} грн)</label>
      </div>
    `).join('')}
  `;

  const recommendedProducts = sameCategoryProducts.slice(0, 3);
  recommendations.innerHTML = `
    <h3>Рекомендації:</h3>
    ${recommendedProducts.map(p => `
      <div class="recommendation">
        <h4>${p.fields.title}</h4>
        <img src="${p.fields.image.fields.file.url}" alt="${p.fields.title}" style="max-width: 150px;" loading="lazy">
        <p>Ціна: ${p.fields.price} грн</p>
        <button onclick="showProductDetails('${p.sys.id}')">Деталі</button>
      </div>
    `).join('')}
  `;
}