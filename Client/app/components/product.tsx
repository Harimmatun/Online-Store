import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface Product {
  id: number; // Змінено з string на number
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
  const { id } = useParams<{ id: string }>(); // Явно вказуємо, що id із useParams є string
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const foundProduct = products.find(p => p.id === Number(id)); // Конвертуємо id у number
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setError('Продукт не знайдено');
    }
  }, [id, products]);

  if (error) {
    return (
      <div className="text-center text-red-500 font-[Poppins] text-lg py-12 animate-fadeIn">
        Помилка: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center font-[Poppins] text-lg py-12 animate-fadeIn">
        Завантаження...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg animate-fadeIn">
        <h2 className="text-3xl sm:text-4xl font-bold font-[Montserrat] text-[#1e2a44] mb-6">
          {product.title}
        </h2>
        <div className="w-full h-48 sm:h-72 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-base mb-6">
          Місце для картинки
        </div>
        <p className="font-[Poppins] text-xl font-semibold text-[#3b82f6] mb-4">
          {product.price} грн
        </p>
        <p className="font-[Poppins] text-base text-gray-600 mb-6 leading-relaxed">
          {product.description || 'Опис продукту буде додано пізніше'}
        </p>
        <button
          onClick={() =>
            addToCart({
              id: product.id,
              name: product.title,
              price: product.price,
              image: product.image || '',
              quantity: 1, // Додаємо quantity, якого бракувало
            })
          }
          className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-6 py-3 rounded-md font-[Poppins] text-base font-semibold hover:scale-105 transition-all duration-300 shadow-md"
        >
          Додати до кошика
        </button>
      </div>
    </div>
  );
}

export default ProductPage;