import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

interface ProductPageProps {
  products: Product[];
}

function ProductPage({ products }: ProductPageProps) {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setError('Продукт не знайдено');
    }
  }, [id, products]);

  if (error) {
    return <div className="text-center text-red-500 font-[Poppins] text-base">Помилка: {error}</div>;
  }

  if (!product) {
    return <div className="text-center font-[Poppins] text-base">Завантаження...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <h2 className="text-3xl font-bold font-[Montserrat] text-[#1e2a44] mb-4">
        {product.title}
      </h2>
      <div className="w-full h-72 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-base mb-6">
        Місце для картинки
      </div>
      <p className="font-[Poppins] text-lg text-[#3b82f6] mb-4">{product.price} грн</p>
      <p className="font-[Poppins] text-base text-gray-600 mb-4">
        {product.description || 'Опис продукту буде додано пізніше'}
      </p>
      <button
        onClick={() => addToCart({ id: product.id, title: product.title, price: product.price })}
        className="bg-[#10b981] text-white px-4 py-2 rounded-md font-[Poppins] text-sm hover:bg-[#059669] transition-colors"
      >
        Додати до кошика
      </button>
    </div>
  );
}

export default ProductPage;