import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-8">
        <h2 className="text-3xl font-bold font-[Montserrat] text-[#1e2a44] text-center mb-8">
          Кошик
        </h2>
        <p className="text-center font-[Poppins] text-base text-[#1e2a44]">
          Ваш кошик порожній
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <h2 className="text-3xl font-bold font-[Montserrat] text-[#1e2a44] text-center mb-8">
        Кошик
      </h2>
      {cart.map(item => (
        <div
          key={item.id}
          className="flex justify-between items-center py-4 border-b border-gray-200"
        >
          <p className="font-[Poppins] text-base text-[#1e2a44]">
            {item.title} (x{item.quantity})
          </p>
          <div className="flex items-center gap-4">
            <p className="font-[Poppins] text-base text-[#3b82f6]">
              {item.price * item.quantity} грн
            </p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md font-[Poppins] text-sm hover:bg-red-600 transition-colors"
            >
              Видалити
            </button>
          </div>
        </div>
      ))}
      <div className="mt-8 text-right">
        <p className="font-[Poppins] text-lg text-[#1e2a44]">
          Загальна сума: {total} грн
        </p>
        <button
          onClick={clearCart}
          className="bg-orange-500 text-white px-4 py-2 rounded-md font-[Poppins] text-sm mt-4 hover:bg-orange-600 transition-colors"
        >
          Очистити кошик
        </button>
      </div>
    </div>
  );
}

export default Cart;