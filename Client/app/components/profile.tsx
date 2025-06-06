import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || null);
      setCity(user.address?.city || '');
      setStreet(user.address?.street || '');
      setHouse(user.address?.house || '');
      setIsDefaultAddress(user.address?.isDefault || false);
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) return;

    const phoneRegex = /^\+380\d{9}$/;
    if (phone && !phoneRegex.test(phone)) {
      setError('Номер телефону має бути у форматі +380XXXXXXXXX');
      return;
    }

    const payload = {
      name,
      email,
      phone,
      avatar,
      address: { city, street, house, isDefault: isDefaultAddress },
    };

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка оновлення профілю');
      }

      const data = await response.json();
      updateUser(data.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <p className="text-center font-[Poppins] text-lg text-[#1e2a44] animate-fadeIn">
          Будь ласка, увійдіть, щоб переглянути профіль.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-2xl animate-fadeIn">
        <h2 className="text-3xl font-bold font-[Montserrat] text-[#1e2a44] text-center mb-8">
          Профіль
        </h2>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-[Poppins]">
                Немає аватарки
              </div>
            )}
          </div>
          <label
            htmlFor="avatar"
            className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white px-4 py-2 rounded-md font-[Poppins] text-sm font-semibold hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Завантажити аватарку
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="font-[Poppins] text-sm text-[#1e2a44] mb-1 block">
                Ім’я
              </label>
              <input
                type="text"
                id="name"
                placeholder="Введіть ім’я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-300 placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-[Poppins] text-sm text-[#1e2a44] mb-1 block">
                Електронна пошта
              </label>
              <input
                type="email"
                id="email"
                placeholder="Введіть пошту"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-300 placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="phone" className="font-[Poppins] text-sm text-[#1e2a44] mb-1 block">
                Номер телефону
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="+380XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-300 placeholder-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="font-[Poppins] text-sm text-[#1e2a44] mb-2 block">
              Місце доставки
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Місто"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-300 placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Вулиця"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-300 placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Будинок"
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 font-[Poppins] text-base focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-300 placeholder-gray-400"
              />
            </div>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={isDefaultAddress}
                onChange={(e) => setIsDefaultAddress(e.target.checked)}
                className="h-4 w-4 text-[#3b82f6] border-gray-200 rounded focus:ring-[#3b82f6]"
              />
              <span className="font-[Poppins] text-sm text-[#1e2a44]">
                Встановити як місце доставки за замовчуванням
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white px-6 py-3 rounded-lg font-[Poppins] text-base font-semibold hover:scale-105 transition-all duration-300 shadow-md"
          >
            Оновити профіль
          </button>
          {error && (
            <p className="text-red-500 font-[Poppins] text-sm text-center animate-fadeIn">
              {error}
            </p>
          )}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-6 py-3 rounded-lg font-[Poppins] text-base font-semibold hover:scale-105 transition-all duration-300 shadow-md mt-4"
          >
            Вийти
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;