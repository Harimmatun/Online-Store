import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ProfileWrapper = styled.div`
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
`;

const ProfileTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  color: #1e2a44;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  background: #3b82f6;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2563eb;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  text-align: center;
`;

const UserInfo = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: #1e2a44;
  margin-bottom: 1rem;
`;

function Profile() {
  const { user, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) return;

    const response = await fetch('/api/auth/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`, // Передача токена для авторизації
      },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      const error = await response.json();
      setError(error.message || 'Помилка оновлення профілю');
      return;
    }

    const data = await response.json();
    setError(null);
    // Оновлюємо користувача в контексті
    // Припускаємо, що бекенд повертає оновлені дані
    setName(data.name);
    setEmail(data.email);
  };

  if (!user) {
    return (
      <ProfileWrapper>
        <p>Будь ласка, увійдіть, щоб переглянути профіль.</p>
      </ProfileWrapper>
    );
  }

  return (
    <ProfileWrapper>
      <ProfileTitle>Профіль</ProfileTitle>
      <UserInfo>Поточне ім’я: {user.name}</UserInfo>
      <UserInfo>Поточна пошта: {user.email}</UserInfo>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Нове ім'я"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Нова електронна пошта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <SubmitButton type="submit">Оновити профіль</SubmitButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SubmitButton onClick={logout} style={{ background: '#ef4444', marginTop: '1rem' }}>
          Вийти
        </SubmitButton>
      </Form>
    </ProfileWrapper>
  );
}

export default Profile;