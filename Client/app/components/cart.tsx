import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  console.log('Cart: cartItems:', cartItems);

  const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(id, quantity);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      alert('Кошик порожній!');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-2xl animate-fadeIn">
        <h2 className="text-3xl font-bold font-[Montserrat] text-[#1e2a44] text-center mb-8">
          Кошик
        </h2>
        {cartItems.length === 0 ? (
          <p className="text-center font-[Poppins] text-lg text-[#1e2a44] animate-fadeIn">
            Кошик порожній.
          </p>
        ) : (
          <>
            <ul className="space-y-4">
              {cartItems.map((item: CartItem) => (
                <li key={item.id} className="flex items-center gap-4 border-b pb-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-[Poppins] text-lg text-[#1e2a44]">{item.name}</h3>
                    <p className="font-[Poppins] text-sm text-gray-500">
                      {item.price} грн x {item.quantity} = {item.price * item.quantity} грн
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="bg-gray-200 px-2 py-1 rounded-md font-[Poppins] text-sm"
                      >
                        -
                      </button>
                      <span className="font-[Poppins] text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="bg-gray-200 px-2 py-1 rounded-md font-[Poppins] text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md font-[Poppins] text-sm ml-4"
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="font-[Poppins] text-lg text-[#1e2a44] text-right">
                Загальна сума: {total} грн
              </p>
              <button
                onClick={handleCheckout}
                className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white px-6 py-3 rounded-lg font-[Poppins] text-base font-semibold hover:scale-105 transition-all duration-300 shadow-md mt-4 w-full"
              >
                Оформити замовлення
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;