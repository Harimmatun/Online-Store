import { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';

function Header() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="bg-[var(--card-bg)] text-[var(--text-primary)] px-4 py-4 shadow-[var(--shadow)] flex flex-col md:flex-row justify-between items-center">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/">
            <h1 className="text-xl md:text-2xl font-bold font-[Montserrat] uppercase tracking-wide m-0">
              Інтернет-магазин
            </h1>
          </Link>
          <button
            onClick={toggleTheme}
            className="text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-colors"
            title={theme === 'light' ? 'Переключити на темну тему' : 'Переключити на світлу тему'}
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
        </div>
        <button
          className="md:hidden text-[var(--text-primary)]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <div className="flex items-center w-full md:w-auto mt-4 md:mt-0">
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Пошук продуктів..."
            className="px-3 py-2 rounded-l-md border-none font-[Poppins] text-base text-[var(--text-primary)] bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--text-secondary)] w-full md:w-48"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--button-bg)] text-[var(--text-primary)] rounded-r-md font-[Poppins] text-base hover:bg-[var(--button-hover-bg)] transition-colors"
          >
            Знайти
          </button>
        </form>
      </div>
      <nav
        className={`flex-col md:flex-row md:flex items-center gap-6 mt-4 md:mt-0 ${
          isMenuOpen ? 'flex' : 'hidden'
        }`}
      >
        <Link
          to="/"
          className="font-[Poppins] text-base px-4 py-2 rounded-md hover:bg-[var(--button-hover-bg)] hover:text-[var(--text-primary)] transition-colors"
        >
          Каталог
        </Link>
        <Link
          to="/cart"
          className="font-[Poppins] text-base px-4 py-2 rounded-md hover:bg-[var(--button-hover-bg)] hover:text-[var(--text-primary)] transition-colors relative"
        >
          Кошик
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--error-text)] text-[var(--card-bg)] text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="font-[Poppins] text-base px-4 py-2 rounded-md hover:bg-[var(--button-hover-bg)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-[var(--text-primary)]">{user.name.charAt(0)}</span>
                  </div>
                )}
                {user.name}
              </Link>
            </div>
            <button
              onClick={logout}
              className="bg-[var(--error-text)] text-[var(--card-bg)] px-4 py-2 rounded-md font-[Poppins] text-base hover:bg-red-600 transition-colors"
            >
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-[var(--button-bg)] text-[var(--text-primary)] px-4 py-2 rounded-md font-[Poppins] text-base hover:bg-[var(--button-hover-bg)] transition-colors"
            >
              Увійти
            </Link>
            <Link
              to="/register"
              className="bg-[var(--button-bg)] text-[var(--text-primary)] px-4 py-2 rounded-md font-[Poppins] text-base hover:bg-[var(--button-hover-bg)] transition-colors"
            >
              Реєстрація
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;