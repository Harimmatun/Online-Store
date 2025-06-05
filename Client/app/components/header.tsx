import { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Header() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="bg-gradient-to-r from-[#1e2a44] to-[#3b82f6] text-white px-4 py-4 shadow-md flex flex-col md:flex-row justify-between items-center">
      <div className="flex w-full justify-between items-center">
        <Link to="/">
          <h1 className="text-xl md:text-2xl font-bold font-[Montserrat] uppercase tracking-wide m-0">
            Інтернет-магазин
          </h1>
        </Link>
        <button
          className="md:hidden text-white"
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
            className="px-3 py-2 rounded-l-md border-none font-[Poppins] text-base text-black focus:outline-none focus:ring-2 focus:ring-[#3b82f6] w-full md:w-48"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-white text-[#1e2a44] rounded-r-md font-[Poppins] text-base hover:bg-gray-200 transition-colors"
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
          className="text-white font-[Poppins] text-base px-4 py-2 rounded-md hover:bg-white/20 transition-colors"
        >
          Каталог
        </Link>
        <Link
          to="/cart"
          className="text-white font-[Poppins] text-base px-4 py-2 rounded-md hover:bg-white/20 transition-colors"
        >
          Кошик
        </Link>
        {user ? (
          <>
            <Link
              to="/profile"
              className="text-white font-[Poppins] text-base px-4 py-2 rounded-md hover:bg-white/20 transition-colors"
            >
              {user.name}
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md font-[Poppins] text-base hover:bg-red-600 transition-colors"
            >
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-[#1e2a44] px-4 py-2 rounded-md font-[Poppins] text-base hover:bg-gray-200 transition-colors"
            >
              Увійти
            </Link>
            <Link
              to="/register"
              className="bg-white text-[#1e2a44] px-4 py-2 rounded-md font-[Poppins] text-base hover:bg-gray-200 transition-colors"
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