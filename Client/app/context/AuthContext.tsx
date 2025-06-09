import { createContext, useContext, useState, useEffect } from 'react';

interface Address {
  city: string;
  street: string;
  house: string;
  isDefault: boolean;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  token: string;
  phone?: string;
  avatar?: string;
  address?: Address;
  language?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  resetPassword: (email: string) => Promise<string>;
  confirmResetPassword: (token: string, newPassword: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
  resetPassword: async () => '',
  confirmResetPassword: async () => '',
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
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
    } else {
      throw new Error(data.message || 'Помилка входу');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data.user);
    } else {
      throw new Error(data.message || 'Помилка реєстрації');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const resetPassword = async (email: string) => {
    if (!email) {
      throw new Error('Будь ласка, введіть електронну пошту!');
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка при відправці запиту');
      }

      return data.message || 'Перевірте вашу пошту для скидання пароля';
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Помилка сервера');
      }
      throw new Error('Помилка сервера');
    }
  };

  const confirmResetPassword = async (token: string, newPassword: string) => {
    if (!token || !newPassword) {
      throw new Error('Токен або новий пароль відсутні.');
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка підтвердження скидання пароля');
      }

      return data.message || 'Пароль успішно скинуто! Будь ласка, увійдіть.';
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Помилка сервера');
      }
      throw new Error('Помилка сервера');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, resetPassword, confirmResetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};