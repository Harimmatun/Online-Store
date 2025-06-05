import { createContext, useContext, useState, useEffect } from 'react';

// Інтерфейс для адреси
interface Address {
  city: string;
  street: string;
  house: string;
  isDefault: boolean;
}

// Інтерфейс для користувача
export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  token: string;
  phone?: string;
  avatar?: string;
  address?: Address;
}

// Інтерфейс для контексту авторизації
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string | undefined, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Мок-відповідь для тестування
    if (email && password) {
      const mockUser = {
        id: '123',
        firstName: 'Test',
        lastName: 'User',
        email: email,
        token: 'mock-token-123',
        phone: undefined,
        avatar: undefined,
        address: undefined,
      };
      setUser(mockUser);
      return;
    }
    throw new Error('Помилка входу: невірний email або пароль');
  };

  const register = async (firstName: string, lastName: string | undefined, email: string, password: string) => {
    // Мок-відповідь для тестування
    if (firstName && email && password) {
      const mockUser = {
        id: '124',
        firstName: firstName,
        lastName: lastName || undefined,
        email: email,
        token: 'mock-token-124',
        phone: undefined,
        avatar: undefined,
        address: undefined,
      };
      setUser(mockUser);
      return;
    }
    throw new Error('Помилка реєстрації: заповніть усі поля');
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);