import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const fullName = lastName ? `${firstName} ${lastName}` : firstName;
      await register(fullName, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[var(--background-gradient)] min-h-screen flex items-center">
      <div className="bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--shadow)] w-full animate-fadeIn">
        <h2 className="text-3xl font-bold font-[Montserrat] text-[var(--text-primary)] text-center mb-8">
          Реєстрація
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <label htmlFor="firstName" className="font-[Poppins] text-sm text-[var(--text-primary)] mb-1 block">
              Ім’я
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Введіть ім’я"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base text-[var(--text-primary)] bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--text-secondary)] transition-all duration-300 placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <label htmlFor="lastName" className="font-[Poppins] text-sm text-[var(--text-primary)] mb-1 block">
              Прізвище (опціонально)
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Введіть прізвище"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base text-[var(--text-primary)] bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--text-secondary)] transition-all duration-300 placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <label htmlFor="email" className="font-[Poppins] text-sm text-[var(--text-primary)] mb-1 block">
              Електронна пошта
            </label>
            <input
              type="email"
              id="email"
              placeholder="Введіть пошту"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base text-[var(--text-primary)] bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--text-secondary)] transition-all duration-300 placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="font-[Poppins] text-sm text-[var(--text-primary)] mb-1 block">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base text-[var(--text-primary)] bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--text-secondary)] transition-all duration-300 placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="bg-[var(--button-gradient)] text-[var(--card-bg)] px-6 py-3 rounded-lg font-[Poppins] text-base font-semibold hover:scale-105 transition-all duration-300 shadow-[var(--shadow)]"
          >
            Зареєструватися
          </button>
          {error && (
            <p className="text-[var(--error-text)] font-[Poppins] text-sm text-center animate-fadeIn">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;