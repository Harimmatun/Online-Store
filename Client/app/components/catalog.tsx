import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../context/CartContext';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
}

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery } = useSearch();
  const { addToCart } = useCart();
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => setError(err.message));
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
    (filterCategory === '' || product.category === filterCategory)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    return 0;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  if (error) {
    return <div className="text-center text-red-500">Помилка: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <h2 className="text-3xl font-bold font-[Montserrat] text-[#1e2a44] text-center mb-8">
        Каталог
      </h2>
      <div className="flex gap-4 mb-8">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 font-[Poppins] text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
        >
          <option value="">Усі категорії</option>
          <option value="Смартфони">Смартфони</option>
          <option value="Ноутбуки">Ноутбуки</option>
          <option value="Планшети">Планшети</option>
          <option value="Аксесуари">Аксесуари</option>
          <option value="Смарт-годинники">Смарт-годинники</option>
          <option value="Телевізори">Телевізори</option>
          <option value="Монітори">Монітори</option>
          <option value="Принтери">Принтери</option>
          <option value="Носії інформації">Носії інформації</option>
          <option value="Мережеве обладнання">Мережеве обладнання</option>
          <option value="Смарт-пристрої">Смарт-пристрої</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 font-[Poppins] text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
        >
          <option value="default">Сортування</option>
          <option value="price-asc">Ціна: від низької до високої</option>
          <option value="price-desc">Ціна: від високої до низької</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md p-4 hover:-translate-y-1 hover:shadow-lg transition-transform duration-300"
          >
            <div className="w-full h-36 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm mb-4">
              Місце для картинки
            </div>
            <h3 className="text-lg font-semibold font-[Poppins] text-[#1e2a44] mb-1">
              {product.title}
            </h3>
            <p className="text-base font-[Poppins] text-[#3b82f6] mb-4">
              {product.price} грн
            </p>
            <div className="flex gap-2">
              <Link
                to={`/product/${product.id}`}
                className="bg-[#3b82f6] text-white px-4 py-2 rounded-md font-[Poppins] text-sm hover:bg-[#2563eb] transition-colors"
              >
                Детальніше
              </Link>
              <button
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.title,
                    price: product.price,
                    image: '',
                    quantity: 1,
                  })
                }
                className="bg-[#10b981] text-white px-4 py-2 rounded-md font-[Poppins] text-sm hover:bg-[#059669] transition-colors"
              >
                Додати до кошика
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-md font-[Poppins] text-sm disabled:opacity-50 hover:bg-gray-300 transition-colors"
        >
          Попередня
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-md font-[Poppins] text-sm ${
              currentPage === page ? 'bg-[#3b82f6] text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md font-[Poppins] text-sm disabled:opacity-50 hover:bg-gray-300 transition-colors"
        >
          Наступна
        </button>
      </div>
    </div>
  );
}

export default Catalog;