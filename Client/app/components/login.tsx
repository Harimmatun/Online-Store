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
    <div className="max-w-md mx-auto px-8 py-8">
      <h2 className="text-3xl font-bold font-[Montserrat] text-[#1e2a44] text-center mb-8">
        Вхід
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Електронна пошта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 border border-gray-200 rounded-md font-[Poppins] text-base focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-3 py-2 border border-gray-200 rounded-md font-[Poppins] text-base focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
        />
        <button
          type="submit"
          className="bg-[#3b82f6] text-white px-4 py-2 rounded-md font-[Poppins] text-base hover:bg-[#2563eb] transition-colors"
        >
          Увійти
        </button>
        {error && (
          <p className="text-red-500 font-[Poppins] text-sm text-center">{error}</p>
        )}
      </form>
      <button
        onClick={handleForgotPassword}
        className="bg-orange-500 text-white px-4 py-2 rounded-md font-[Poppins] text-sm mt-4 w-full hover:bg-orange-600 transition-colors"
      >
        Забув пароль?
      </button>
    </div>
  );
}

export default Login;