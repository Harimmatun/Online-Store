import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPopup() {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    setIsOpen(false);
    navigate('/cart');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white p-4 rounded-full flex items-center justify-center relative cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={handleCartClick}
      >
        <span className="text-2xl">🛒</span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-[Poppins] font-semibold">
            {totalItems}
          </span>
        )}
      </div>
      <div
        className={`${
          isOpen ? 'block scale-100 opacity-100' : 'hidden scale-95 opacity-0'
        } absolute bottom-16 right-0 w-64 sm:w-72 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 text-[#1e2a44] transform transition-all duration-300 origin-bottom-right`}
      >
        {cart.length === 0 ? (
          <p className="font-[Poppins] text-sm text-center">Кошик порожній</p>
        ) : (
          <div className="space-y-2">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <p className="font-[Poppins] text-sm truncate">
                  {item.title} <span className="text-gray-500">(x{item.quantity})</span>
                </p>
                <p className="font-[Poppins] text-sm text-[#3b82f6]">
                  {item.price * item.quantity} грн
                </p>
              </div>
            ))}
            <button
              onClick={handleCartClick}
              className="w-full mt-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white px-4 py-2 rounded-md font-[Poppins] text-sm hover:from-[#2563eb] hover:to-[#1e40af] transition-all duration-300"
            >
              Перейти до кошика
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPopup;