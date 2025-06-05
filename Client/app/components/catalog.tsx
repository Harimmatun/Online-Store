import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext'; // Додано useCart

const CatalogWrapper = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CatalogTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  color: #1e2a44;
  text-align: center;
  margin-bottom: 2rem;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ProductCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImagePlaceholder = styled.div`
  width: 100%;
  height: 150px;
  background: #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ProductTitle = styled.h3`
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  color: #1e2a44;
  margin: 0 0 0.5rem;
`;

const ProductPrice = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: #3b82f6;
  margin: 0 0 1rem;
`;

const ProductButton = styled(Link)`
  display: inline-block;
  background: #3b82f6;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  transition: background 0.3s ease;

  &:hover {
    background: #2563eb;
  }
`;

const AddToCartButton = styled.button`
  display: inline-block;
  background: #10b981;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #059669;
  }
`;

const FilterSortContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  font-family: 'Poppins', sans-serif;
`;

const SortSelect = styled.select`
  padding: 0.5rem;
  font-family: 'Poppins', sans-serif;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

function Catalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery } = useSearch();
  const { addToCart } = useCart(); // Додано useCart
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => setError(err.message));
  }, []);

  // Фільтрація та пошук
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
    (filterCategory === '' || product.category === filterCategory)
  );

  // Сортування
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    return 0;
  });

  // Пагінація
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  if (error) {
    return <div>Помилка: {error}</div>;
  }

  return (
    <CatalogWrapper>
      <CatalogTitle>Каталог</CatalogTitle>
      <FilterSortContainer>
        <FilterSelect value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
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
        </FilterSelect>
        <SortSelect value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="default">Сортування</option>
          <option value="price-asc">Ціна: від низької до високої</option>
          <option value="price-desc">Ціна: від високої до низької</option>
        </SortSelect>
      </FilterSortContainer>
      <ProductsGrid>
        {currentProducts.map(product => (
          <ProductCard key={product.id}>
            <ProductImagePlaceholder>Місце для картинки</ProductImagePlaceholder>
            <ProductTitle>{product.title}</ProductTitle>
            <ProductPrice>{product.price} грн</ProductPrice>
            <div>
              <ProductButton to={`/product/${product.id}`}>Детальніше</ProductButton>
              <AddToCartButton onClick={() => addToCart({ id: product.id, title: product.title, price: product.price })}>
                Додати до кошика
              </AddToCartButton>
            </div>
          </ProductCard>
        ))}
      </ProductsGrid>
      <Pagination>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Попередня
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{ fontWeight: currentPage === page ? 'bold' : 'normal' }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Наступна
        </button>
      </Pagination>
    </CatalogWrapper>
  );
}

export default Catalog;