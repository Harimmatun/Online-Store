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
    <div className="fixed bottom-5 right-5 z-50">
      <div
        className="bg-[#3b82f6] text-white p-3 rounded-full flex items-center justify-center relative cursor-pointer hover:bg-[#2563eb] transition-colors"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={handleCartClick}
      >
        <span className="text-xl">🛒</span>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 text-xs">
            {totalItems}
          </span>
        )}
      </div>
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } absolute bottom-16 right-0 w-72 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-[#1e2a44]`}
      >
        {cart.length === 0 ? (
          <p className="font-[Poppins] text-sm">Кошик порожній</p>
        ) : (
          cart.map(item => (
            <div key={item.id} className="flex justify-between mb-2">
              <p className="font-[Poppins] text-sm">
                {item.title} (x{item.quantity})
              </p>
              <p className="font-[Poppins] text-sm text-[#3b82f6]">
                {item.price * item.quantity} грн
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CartPopup;