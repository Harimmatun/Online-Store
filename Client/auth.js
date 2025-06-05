export async function registerUser() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();
  const messageElement = document.getElementById('registerMessage');

  if (!name || !email || !password) {
    messageElement.textContent = 'Будь ласка, заповніть усі поля!';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (response.ok) {
      messageElement.textContent = 'Реєстрація успішна! Будь ласка, увійдіть.';
      setTimeout(() => showSection('login'), 2000);
    } else {
      messageElement.textContent = data.message || 'Помилка реєстрації. Перевірте сервер.';
    }
  } catch (error) {
    messageElement.textContent = 'Помилка сервера або мережевий збій';
    console.error('Registration error:', error.message, error.stack);
  }
}

export async function loginUser() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const messageElement = document.getElementById('loginMessage');

  if (!email || !password) {
    messageElement.textContent = 'Будь ласка, заповніть усі поля!';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      window.currentUser = data.user;
      updateAuthStatus();
      messageElement.textContent = 'Вхід успішний!';
      setTimeout(() => showSection('catalog'), 2000);
    } else {
      messageElement.textContent = data.message || 'Помилка входу';
    }
  } catch (error) {
    messageElement.textContent = 'Помилка сервера';
    console.error('Login error:', error.message, error.stack);
  }
}

export async function resetPassword(email) {
  if (!email) {
    throw new Error('Будь ласка, введіть електронну пошту!');
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || 'Помилка при відправці запиту');
    }

    return data.message || 'Перевірте вашу пошту для скидання пароля';
  } catch (error) {
    throw new Error(error.message || 'Помилка сервера');
  }
}

export async function confirmResetPassword(token, newPassword) {
  if (!token || !newPassword) {
    throw new Error('Токен або новий пароль відсутні.');
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/reset-password-confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || 'Помилка підтвердження скидання пароля');
    }

    return data.message || 'Пароль успішно скинуто! Будь ласка, увійдіть.';
  } catch (error) {
    throw new Error(error.message || 'Помилка сервера');
  }
}

export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  window.currentUser = null;
  updateAuthStatus();
  showSection('catalog');
}

export function updateAuthStatus() {
  const userStatus = document.getElementById('userStatus');
  const registerBtn = document.getElementById('registerBtn');
  const loginBtn = document.getElementById('loginBtn');
  const avatarButton = document.getElementById('avatarButton');

  if (userStatus && registerBtn && loginBtn && avatarButton) {
    if (window.currentUser) {
      userStatus.textContent = window.currentUser.name || 'Користувач';
      registerBtn.style.display = 'none';
      loginBtn.style.display = 'none';
      avatarButton.style.display = 'block';
      if (window.currentUser.avatar) {
        avatarButton.src = window.currentUser.avatar;
      }
    } else {
      userStatus.textContent = 'Гість';
      registerBtn.style.display = 'block';
      loginBtn.style.display = 'block';
      avatarButton.style.display = 'none';
    }
  } else {
    console.error('Один або кілька елементів не знайдено:', { userStatus, registerBtn, loginBtn, avatarButton });
  }
}

export async function loadProfile() {
  if (!window.currentUser) return;
  document.getElementById('profileName').value = window.currentUser.name || '';
  document.getElementById('profileEmail').value = window.currentUser.email || '';
  document.getElementById('profilePhone').value = window.currentUser.phone || '';
  document.getElementById('profileLanguage').value = window.currentUser.language || 'uk';
}

export async function saveProfile() {
  const name = document.getElementById('profileName').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();
  const currentPassword = document.getElementById('profileCurrentPassword').value.trim();
  const newPassword = document.getElementById('profileNewPassword').value.trim();
  const language = document.getElementById('profileLanguage').value;
  const messageElement = document.getElementById('profileMessage');

  if (!name || !phone) {
    messageElement.textContent = 'Будь ласка, заповніть ім’я та телефон!';
    return;
  }

  const updateData = { name, phone, language };
  if (currentPassword && newPassword) {
    updateData.currentPassword = currentPassword;
    updateData.newPassword = newPassword;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updateData)
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (response.ok) {
      window.currentUser = { ...window.currentUser, ...data.user };
      localStorage.setItem('currentUser', JSON.stringify(window.currentUser));
      updateAuthStatus();
      messageElement.textContent = 'Профіль оновлено!';
    } else {
      messageElement.textContent = data.message || 'Помилка оновлення профілю';
    }
  } catch (error) {
    messageElement.textContent = 'Помилка сервера';
    console.error('Profile update error:', error.message, error.stack);
  }
}

export function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ avatar: e.target.result })
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (response.ok) {
        window.currentUser.avatar = data.avatar;
        localStorage.setItem('currentUser', JSON.stringify(window.currentUser));
        document.getElementById('avatarButton').src = data.avatar;
        document.getElementById('profileMessage').textContent = 'Аватар оновлено!';
      } else {
        document.getElementById('profileMessage').textContent = data.message || 'Помилка завантаження аватара';
      }
    } catch (error) {
      document.getElementById('profileMessage').textContent = 'Помилка сервера';
      console.error('Avatar upload error:', error.message, error.stack);
    }
  };
  reader.readAsDataURL(file);
}