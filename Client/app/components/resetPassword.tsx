import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword, confirmResetPassword } = useAuth(); 

  useEffect(() => {
    if (token) {
      setMessage('Введіть новий пароль для скидання.');
    }
  }, [token]);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Надсилаємо запит...');
    try {
      const responseMessage = await resetPassword(email); 
      setMessage(responseMessage);
    } catch (error: any) {
      setMessage(error.message || 'Помилка при відправці запиту. Спробуйте ще раз.');
      console.error('Reset request error:', error);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newPassword) {
      setMessage('Токен або новий пароль відсутні.');
      return;
    }
    setMessage('Оновлюємо пароль...');
    try {
      const responseMessage = await confirmResetPassword(token, newPassword); 
      setMessage(responseMessage);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error: any) {
      setMessage(error.message || 'Помилка при скиданні пароля. Перевірте токен або спробуйте знову.');
      console.error('Confirm reset error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full animate-fadeIn">
        <h2 className="text-3xl font-bold font-[Montserrat] text-[#1e2a44] text-center mb-8">
          Скидання пароля
        </h2>
        {token ? (
          <form onSubmit={handleConfirmReset} className="flex flex-col gap-4">
            <div className="relative">
              <label htmlFor="newPassword" className="font-[Poppins] text-sm text-[#1e2a44] mb-1 block">
                Новий пароль
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-300 placeholder-gray-400"
                placeholder="Введіть новий пароль"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-6 py-3 rounded-lg font-[Poppins] text-base font-semibold hover:scale-105 transition-all duration-300 shadow-md"
            >
              Скинути пароль
            </button>
            {message && (
              <p
                className={`font-[Poppins] text-sm text-center animate-fadeIn ${
                  message.includes('Помилка') ? 'text-red-500' : 'text-[#10b981]'
                }`}
              >
                {message}
              </p>
            )}
          </form>
        ) : (
          <form onSubmit={handleResetRequest} className="flex flex-col gap-4">
            <div className="relative">
              <label htmlFor="email" className="font-[Poppins] text-sm text-[#1e2a44] mb-1 block">
                Електронна пошта
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-300 placeholder-gray-400"
                placeholder="Введіть вашу пошту"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white px-6 py-3 rounded-lg font-[Poppins] text-base font-semibold hover:scale-105 transition-all duration-300 shadow-md"
            >
              Надіслати запит на скидання
            </button>
            {message && (
              <p
                className={`font-[Poppins] text-sm text-center animate-fadeIn ${
                  message.includes('Помилка') ? 'text-red-500' : 'text-[#10b981]'
                }`}
              >
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;