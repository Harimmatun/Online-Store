import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error] = useState<string | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutRedirect = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (!cart.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <p className="text-center font-[Poppins] text-lg text-[#1e2a44] animate-fadeIn">
          Кошик порожній
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h2 className="text-3xl font-bold font-[Montserrat] text-[#1e2a44] text-center mb-8">
        Кошик
      </h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md"
          >
            <div>
              <h3 className="text-lg font-[Poppins] text-[#1e2a44]">{item.name}</h3>
              <p className="text-base font-[Poppins] text-[#3b82f6]">{item.price} грн x {item.quantity}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md font-[Poppins] text-sm hover:bg-red-600 transition-colors"
            >
              Видалити
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <p className="text-xl font-[Poppins] text-[#1e2a44]">
          Загалом: {total} грн
        </p>
      </div>
      <button
        onClick={handleCheckoutRedirect}
        disabled={!user}
        className="mt-4 bg-[#10b981] text-white px-6 py-3 rounded-lg font-[Poppins] text-base font-semibold hover:bg-[#059669] transition-colors disabled:opacity-50"
      >
        Оформити замовлення
      </button>
      {error && (
        <p className="text-red-500 font-[Poppins] text-sm text-center mt-2 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}

export default Cart;