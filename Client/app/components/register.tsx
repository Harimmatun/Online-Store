import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const RegisterWrapper = styled.div`
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
`;

const RegisterTitle = styled.h2`
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

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
      navigate('/'); // Перенаправлення на головну сторінку після успішної реєстрації
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <RegisterWrapper>
      <RegisterTitle>Реєстрація</RegisterTitle>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Ім'я"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Електронна пошта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <SubmitButton type="submit">Зареєструватися</SubmitButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </RegisterWrapper>
  );
}

export default Register;