import { createContext, useContext, useState, useEffect } from 'react';

// Інтерфейс для адреси
interface Address {
  city: string;
  street: string;
  house: string;
  isDefault: boolean;
}

// Інтерфейс для користувача
interface User {
  name: string;
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
  register: (name: string, email: string, password: string) => Promise<void>;
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
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Помилка входу');
    }

    const data = await response.json();
    setUser({
      name: data.name,
      email: data.email,
      token: data.token,
      phone: data.phone || undefined,
      avatar: data.avatar || undefined,
      address: data.address || undefined,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Помилка реєстрації');
    }

    const data = await response.json();
    setUser({
      name: data.name,
      email: data.email,
      token: data.token,
      phone: data.phone || undefined,
      avatar: data.avatar || undefined,
      address: data.address || undefined,
    });
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