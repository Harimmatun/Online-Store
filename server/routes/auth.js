const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_SECURE', 'EMAIL_USER', 'EMAIL_PASS', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is missing`);
  }
}

console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_SECURE:', process.env.EMAIL_SECURE);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '[HIDDEN]' : 'undefined');

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10);
const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true';

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  family: 4,
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email transporter is ready');
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач із таким email уже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    const user = new User({
      name,
      email,
      password: hashedPassword,
      token,
    });

    await user.save();

    res.status(201).json({ user: { name, email, token } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Помилка сервера під час реєстрації' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Неправильний email або пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неправильний email або пароль' });
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    user.token = token;
    await user.save();

    res.json({ user: { name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, address: user.address, token } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Помилка сервера під час входу' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Користувач не знайдений' });
    }

    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    user.resetToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password-confirm?token=${resetToken}`;
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Скидання пароля',
      text: `Клікніть за посиланням для скидання пароля: ${resetLink}`,
      html: `<p>Клікніть <a href="${resetLink}">тут</a> для скидання пароля.</p>`,
    });

    res.json({ message: 'Перевірте вашу пошту для скидання пароля' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Помилка сервера під час скидання пароля' });
  }
});

router.post('/reset-password-confirm', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      email: decoded.email,
      resetToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Невалідний або застарілий токен' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Пароль успішно скинуто' });
  } catch (error) {
    console.error('Confirm reset password error:', error);
    if (error.name === 'JsonWebTokenError') {
      res.status(400).json({ message: 'Невалідний токен' });
    } else {
      res.status(500).json({ message: 'Помилка сервера' });
    }
  }
});

router.put('/profile', async (req, res) => {
  const { name, phone, language, currentPassword, newPassword, avatar, address } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен авторизації відсутній' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email, token });

    if (!user) {
      return res.status(401).json({ message: 'Невалідний токен' });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.language = language || user.language;
    user.avatar = avatar || user.avatar;
    user.address = address || user.address;

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Поточний пароль неправильний' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        language: user.language,
        token: user.token,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Невалідний токен' });
    } else {
      res.status(500).json({ message: 'Помилка сервера під час оновлення профілю' });
    }
  }
});

router.post('/order', async (req, res) => {
  const { items, total, address } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен авторизації відсутній' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email, token });

    if (!user) {
      return res.status(401).json({ message: 'Невалідний токен' });
    }

    const order = new Order({
      userId: user._id,
      items,
      total,
      address,
    });

    await order.save();

    res.status(201).json({ message: 'Замовлення успішно створено', order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Помилка сервера під час створення замовлення', error: error.message });
  }
});

module.exports = router;