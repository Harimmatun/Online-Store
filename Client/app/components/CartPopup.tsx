import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function CartPopup() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  console.log('CartPopup: cartItems:', cartItems);

  const total = Array.isArray(cartItems)
    ? cartItems.reduce((sum: number, item: CartItem) => {
        console.log('CartPopup: calculating total for item:', item);
        const validQuantity = isNaN(item.quantity) ? 1 : item.quantity;
        return sum + item.price * validQuantity;
      }, 0)
    : 0;

  console.log('CartPopup: total:', total);

  const handleGoToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
      <h3 className="text-lg font-bold font-[Montserrat] text-[#1e2a44] mb-4">Кошик</h3>
      {(!cartItems || cartItems.length === 0) ? (
        <p className="font-[Poppins] text-sm text-[#1e2a44]">Кошик порожній.</p>
      ) : (
        <>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {cartItems.map((item: CartItem) => (
              <li key={item.id} className="flex justify-between items-center font-[Poppins] text-sm text-[#1e2a44]">
                <span>{item.name} x {isNaN(item.quantity) ? 1 : item.quantity}</span>
                <span>{item.price * (isNaN(item.quantity) ? 1 : item.quantity)} грн</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t pt-2">
            <p className="font-[Poppins] text-sm text-[#1e2a44] font-semibold">
              Загальна сума: {total} грн
            </p>
            <button
              onClick={handleGoToCart}
              className="mt-2 w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white px-4 py-2 rounded-lg font-[Poppins] text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-md"
            >
              Перейти до кошика
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPopup;