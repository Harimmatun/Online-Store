import { useCart, type CartItem } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function CartPopup() {
  const { cart } = useCart();
  const navigate = useNavigate();

  console.log('CartPopup: cart:', cart);

  const total = Array.isArray(cart)
    ? cart.reduce((sum: number, item: CartItem) => {
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
    <div className="fixed bottom-4 right-4 bg-[var(--card-bg)] p-4 rounded-lg shadow-[var(--shadow)] max-w-sm w-full">
      <h3 className="text-lg font-bold font-[Montserrat] text-[var(--text-primary)] mb-4">Кошик</h3>
      {(!cart || cart.length === 0) ? (
        <p className="font-[Poppins] text-sm text-[var(--text-primary)]">Кошик порожній.</p>
      ) : (
        <>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center font-[Poppins] text-sm text-[var(--text-primary)]">
                <span>{item.name} x {isNaN(item.quantity) ? 1 : item.quantity}</span>
                <span>{item.price * (isNaN(item.quantity) ? 1 : item.quantity)} грн</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t pt-2">
            <p className="font-[Poppins] text-sm text-[var(--text-primary)] font-semibold">
              Загальна сума: {total} грн
            </p>
            <button
              onClick={handleGoToCart}
              className="mt-2 w-full bg-[var(--button-gradient)] text-[var(--card-bg)] px-4 py-2 rounded-lg font-[Poppins] text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-[var(--shadow)]"
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