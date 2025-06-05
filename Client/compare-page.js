document.addEventListener("DOMContentLoaded", () => {
    // Завантажуємо товари для порівняння та originalProducts з localStorage
    window.originalProducts = JSON.parse(localStorage.getItem('originalProducts')) || [];
    const compareItems = JSON.parse(localStorage.getItem('compareItems')) || [];
    window.compareItems = compareItems;
  
    const compareList = document.getElementById('compareList');
    if (!compareList) {
      console.error('Елемент #compareList не знайдено на сторінці');
      return;
    }
  
    if (compareItems.length === 0) {
      compareList.innerHTML = '<p style="text-align: center; color: #e74c3c;">Немає товарів для порівняння</p>';
      return;
    }
  
    compareList.innerHTML = `
      <h2>Порівняння товарів</h2>
      <div class="compare-table">
        ${compareItems.map(item => `
          <div class="compare-item">
            <h3>${item.fields.title}</h3>
            <img src="${item.fields.image.fields.file.url}" alt="${item.fields.title}" style="max-width: 200px;" loading="lazy">
            <p>Ціна: ${item.fields.price} грн</p>
            <p>Категорія: ${item.fields.category}</p>
            <p>Опис: ${item.fields.description || 'Немає опису'}</p>
            <button class="remove-from-compare" data-id="${item.sys.id}">Видалити</button>
          </div>
        `).join('')}
      </div>
    `;
  
    const removeButtons = document.querySelectorAll('.remove-from-compare');
    removeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        window.compareItems = window.compareItems.filter(item => item.sys.id !== id);
        localStorage.setItem('compareItems', JSON.stringify(window.compareItems));
        if (window.compareItems.length === 0) {
          localStorage.setItem('sectionToShow', 'catalog');
          window.location.href = 'index.html';
        } else {
          window.location.reload();
        }
      });
    });
  
    // Прив’язка кнопки повернення
    document.getElementById('backToCatalogBtn')?.addEventListener('click', () => {
      localStorage.setItem('sectionToShow', 'catalog');
      window.location.href = 'index.html';
    });
  });