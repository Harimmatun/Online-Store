import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { CartItem } from '../context/CartContext';

function Checkout() {
  const { cart, checkout } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    house: user?.address?.house || '',
    paymentMethod: 'card',
  });

  const [error, setError] = useState<string | null>(null);

  const total = Array.isArray(cart)
    ? cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
    : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.token) {
      setError('Користувач не авторизований');
      navigate('/login');
      return;
    }

    if (!cart || cart.length === 0) {
      setError('Кошик порожній!');
      return;
    }

    try {
      const updatedUser = {
        ...user,
        address: {
          city: formData.city,
          street: formData.street,
          house: formData.house,
        },
      };

      await checkout();

      setError(null);
      navigate('/profile');
    } catch (error: unknown) {
      console.error('Checkout: Error creating order:', error);
      if (error instanceof Error) {
        setError(error.message || 'Сталася помилка при створенні замовлення. Спробуйте ще раз.');
      } else {
        setError('Сталася помилка при створенні замовлення. Спробуйте ще раз.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-2xl animate-fadeIn">
        <h2 className="text-3xl font-bold font-[Montserrat] text-[#1e2a44] text-center mb-8">
          Оформлення замовлення
        </h2>
        {error && (
          <p className="text-red-500 font-[Poppins] text-sm text-center mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold font-[Montserrat] text-[#1e2a44] mb-4">
              Інформація про доставку
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block font-[Poppins] text-sm text-[#1e2a44] mb-1" htmlFor="name">
                  Ім'я
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] font-[Poppins] text-sm"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-[Poppins] text-sm text-[#1e2a44] mb-1" htmlFor="email">
                Електронна пошта
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] font-[Poppins] text-sm"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block font-[Poppins] text-sm text-[#1e2a44] mb-1" htmlFor="phone">
                Телефон
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] font-[Poppins] text-sm"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block font-[Poppins] text-sm text-[#1e2a44] mb-1" htmlFor="street">
                Вулиця
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] font-[Poppins] text-sm"
                required
              />
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-[Poppins] text-sm text-[#1e2a44] mb-1" htmlFor="city">
                  Місто
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] font-[Poppins] text-sm"
                  required
                />
              </div>
              <div>
                <label className="block font-[Poppins] text-sm text-[#1e2a44] mb-1" htmlFor="house">
                  Будинок
                </label>
                <input
                  type="text"
                  id="house"
                  name="house"
                  value={formData.house}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] font-[Poppins] text-sm"
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold font-[Montserrat] text-[#1e2a44] mb-4">
              Спосіб оплати
            </h3>
            <div>
              <label className="block font-[Poppins] text-sm text-[#1e2a44] mb-1" htmlFor="paymentMethod">
                Оберіть спосіб оплати
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] font-[Poppins] text-sm"
              >
                <option value="card">Кредитна картка</option>
                <option value="cash">Готівка при отриманні</option>
              </select>
            </div>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-xl font-semibold font-[Montserrat] text-[#1e2a44] mb-4">
              Підсумок замовлення
            </h3>
            <p className="font-[Poppins] text-sm text-[#1e2a44] mb-2">
              Загальна сума: {total} грн
            </p>
            <button
              type="submit"
              className="w-full bg-[#ff6b6b] text-white py-3 rounded-lg font-[Montserrat] font-semibold text-sm hover:bg-[#ff8787] transition-colors duration-300"
            >
              Підтвердити замовлення
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;