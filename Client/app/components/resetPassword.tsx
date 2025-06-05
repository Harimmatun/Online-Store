import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resetPassword, confirmResetPassword } from '../auth'; // Правильний шлях

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      setMessage('Введіть новий пароль для скидання.');
    }
  }, [token]);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Надсилаємо запит...');
    try {
      const responseMessage = await resetPassword(email);
      setMessage(responseMessage);
    } catch (error: any) {
      setMessage(error.message || 'Помилка при відправці запиту. Спробуйте ще раз.');
      console.error('Reset request error:', error);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newPassword) {
      setMessage('Токен або новий пароль відсутні.');
      return;
    }
    setMessage('Оновлюємо пароль...');
    try {
      const responseMessage = await confirmResetPassword(token, newPassword);
      setMessage(responseMessage);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error: any) {
      setMessage(error.message || 'Помилка при скиданні пароля. Перевірте токен або спробуйте знову.');
      console.error('Confirm reset error:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
      <h2>Скидання пароля</h2>
      {token ? (
        <form onSubmit={handleConfirmReset}>
          <div>
            <label htmlFor="newPassword">Новий пароль:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', margin: '10px 0' }}
              required
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
            Скинути пароль
          </button>
          {message && <p style={{ color: message.includes('Помилка') ? 'red' : 'green' }}>{message}</p>}
        </form>
      ) : (
        <form onSubmit={handleResetRequest}>
          <div>
            <label htmlFor="email">Електронна пошта:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', margin: '10px 0' }}
              required
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
            Надіслати запит на скидання
          </button>
          {message && <p style={{ color: message.includes('Помилка') ? 'red' : 'green' }}>{message}</p>}
        </form>
      )}
    </div>
  );
}

export default ResetPassword;