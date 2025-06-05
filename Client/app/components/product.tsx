import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext'; // Додано useCart

// Інтерфейс для продукту
interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

// Інтерфейс для пропсів
interface ProductPageProps {
  products: Product[];
}

const ProductWrapper = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const ProductTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  color: #1e2a44;
  margin-bottom: 1rem;
`;

const ProductImagePlaceholder = styled.div`
  width: 100%;
  height: 300px;
  background: #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const ProductPrice = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  color: #3b82f6;
  margin-bottom: 1rem;
`;

const ProductDescription = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: #4b5563;
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
  margin-top: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #059669;
  }
`;

function ProductPage({ products }: ProductPageProps) {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart(); // Додано useCart

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setError('Продукт не знайдено');
    }
  }, [id, products]);

  if (error) {
    return <div>Помилка: {error}</div>;
  }

  if (!product) {
    return <div>Завантаження...</div>;
  }

  return (
    <ProductWrapper>
      <ProductTitle>{product.title}</ProductTitle>
      <ProductImagePlaceholder>Місце для картинки</ProductImagePlaceholder>
      <ProductPrice>{product.price} грн</ProductPrice>
      <ProductDescription>{product.description || 'Опис продукту буде додано пізніше'}</ProductDescription>
      <AddToCartButton onClick={() => addToCart({ id: product.id, title: product.title, price: product.price })}>
        Додати до кошика
      </AddToCartButton>
    </ProductWrapper>
  );
}

export default ProductPage;