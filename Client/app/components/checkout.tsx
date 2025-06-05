import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
  });

  const total = Array.isArray(cartItems) ? cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0) : 0;

  console.log('Checkout: cartItems:', cartItems);
  console.log('Checkout: total:', total);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.token) {
      console.log('Checkout: User or token missing, redirecting to login');
      navigate('/login');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      console.log('Checkout: Cart is empty');
      alert('Кошик порожній!');
      return;
    }

    const orderData = {
      userId: user.id,
      items: cartItems,
      total: total,
      shipping: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      paymentMethod: formData.paymentMethod,
      createdAt: new Date().toISOString(),
    };

    console.log('Checkout: Submitting order:', orderData);

    try {
      const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create order: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Checkout: Order created:', data);

      clearCart();
      navigate('/profile');
    } catch (error) {
      console.error('Checkout: Error creating order:', error);
      alert('Сталася помилка при створенні замовлення. Перевірте, чи працює сервер, і спробуйте ще раз.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-2xl animate-fadeIn">
        <h2 className="text-3xl font-bold font-[Montserrat] text-[#1e2a44] text-center mb-8">
          Оформлення замовлення
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold font-[Montserrat] text-[#1e2a44] mb-4">
              Інформація про доставку
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-[Poppins] text-sm text-[#1e2a44] mb-1" htmlFor="firstName">
                  Ім'я
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] font-[Poppins] text-sm"
                  required
                />
              </div>
              <div>
                <label className="block font-[Poppins] text-sm text-[#1e2a44] mb-1" htmlFor="lastName">
                  Прізвище
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
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
              <label className="block font-[Poppins] text-sm text-[#1e2a44] mb-1" htmlFor="address">
                Адреса
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
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
                <label className="block font-[Poppins] text-sm text-[#1e2a44] mb-1" htmlFor="postalCode">
                  Поштовий індекс
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
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