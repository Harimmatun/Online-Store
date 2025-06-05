import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleForgotPassword = () => {
    navigate('/reset-password');
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full animate-fadeIn">
        <h2 className="text-3xl font-bold font-[Montserrat] text-[#1e2a44] text-center mb-8">
          Вхід
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Електронна пошта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-300 placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-300 placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white px-6 py-3 rounded-lg font-[Poppins] text-base font-semibold hover:scale-105 transition-all duration-300 shadow-md"
          >
            Увійти
          </button>
          {error && (
            <p className="text-red-500 font-[Poppins] text-sm text-center animate-fadeIn">
              {error}
            </p>
          )}
        </form>
        <button
          onClick={handleForgotPassword}
          className="mt-6 w-full bg-gradient-to-r from-[#ff9800] to-[#f57c00] text-white px-6 py-3 rounded-lg font-[Poppins] text-base font-semibold hover:scale-105 transition-all duration-300 shadow-md"
        >
          Забув пароль?
        </button>
      </div>
    </div>
  );
}

export default Login;