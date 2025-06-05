import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center gap-3 mb-8">
          <svg
            className="w-8 h-8 text-[#1e2a44]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-2xl sm:text-3xl font-bold font-[Montserrat] text-[#1e2a44]">
            Кошик
          </h2>
        </div>
        <p className="text-center font-[Poppins] text-lg text-[#1e2a44] animate-fadeIn">
          Ваш кошик порожній
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-center gap-3 mb-8">
        <svg
          className="w-8 h-8 text-[#1e2a44]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h2 className="text-2xl sm:text-3xl font-bold font-[Montserrat] text-[#1e2a44]">
          Кошик
        </h2>
      </div>
      <div className="space-y-4">
        {cart.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="font-[Poppins] text-base sm:text-lg text-[#1e2a44] mb-2 sm:mb-0">
              {item.title} <span className="text-gray-500">(x{item.quantity})</span>
            </p>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <p className="font-[Poppins] text-base sm:text-lg text-[#3b82f6] flex-1 sm:flex-none">
                {item.price * item.quantity} грн
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-md font-[Poppins] text-sm hover:from-red-600 hover:to-red-700 transition-all duration-300"
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm text-right animate-fadeIn">
        <p className="font-[Poppins] text-xl font-semibold text-[#1e2a44] mb-4">
          Загальна сума: {total} грн
        </p>
        <button
          onClick={clearCart}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-md font-[Poppins] text-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
        >
          Очистити кошик
        </button>
      </div>
    </div>
  );
}

export default Cart;