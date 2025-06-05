import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const LoginWrapper = styled.div`
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
`;

const LoginTitle = styled.h2`
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

const ForgotPasswordButton = styled.button`
  background: #ff9800;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background: #f57c00;
  }
`;

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
      navigate('/'); // Перенаправлення на головну сторінку після входу
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleForgotPassword = () => {
    navigate('/reset-password'); // Перенаправлення на сторінку скидання пароля
  };

  return (
    <LoginWrapper>
      <LoginTitle>Вхід</LoginTitle>
      <Form onSubmit={handleSubmit}>
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
        <SubmitButton type="submit">Увійти</SubmitButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
      <ForgotPasswordButton onClick={handleForgotPassword}>
        Забув пароль?
      </ForgotPasswordButton>
    </LoginWrapper>
  );
}

export default Login;