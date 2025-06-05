import { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext'; // Додано useAuth
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderStyled = styled.header`
  background: linear-gradient(90deg, #1e2a44, #3b82f6);
  color: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const AuthButton = styled(Link)`
  background: #ffffff;
  color: #1e2a44;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.3s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

const LogoutButton = styled.button`
  background: #ef4444;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #dc2626;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: none;
  border-radius: 4px 0 0 4px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  outline: none;
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: #ffffff;
  color: #1e2a44;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

function Header() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { user, logout } = useAuth(); // Використовуємо useAuth

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Оновлюємо контекст для пошуку
  };

  return (
    <HeaderStyled>
      <Link to="/">
        <Logo>Інтернет-магазин</Logo>
      </Link>
      <SearchContainer>
        <form onSubmit={handleSearch}>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Пошук продуктів..."
          />
          <SearchButton type="submit">Знайти</SearchButton>
        </form>
      </SearchContainer>
      <Nav>
        <NavLink to="/">Каталог</NavLink>
        <NavLink to="/cart">Кошик</NavLink>
        {user ? (
          <>
            <NavLink to="/profile">{user.name}</NavLink>
            <LogoutButton onClick={logout}>Вийти</LogoutButton>
          </>
        ) : (
          <>
            <AuthButton to="/login">Увійти</AuthButton>
            <AuthButton to="/register">Реєстрація</AuthButton>
          </>
        )}
      </Nav>
    </HeaderStyled>
  );
}

export default Header;