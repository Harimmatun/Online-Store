const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

describe('Online Store API', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await mongoose.connect(process.env.MONGO_URI, {
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
  });

  it('should get all products', async () => {
    await Product.create({
      title: 'Test Product',
      price: 100,
      category: 'Test Category',
      description: 'Test Description',
      image: 'https://via.placeholder.com/150'
    });

    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Test Product');
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should not register a user with existing email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'test@example.com',
        password: 'Password123!'
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email already registered');
  });

  it('should login a user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should create an order', async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      });

    const token = registerRes.body.token;

    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user: 'Test User',
        address: 'Test Address',
        phone: '+380123456789',
        items: [{ name: 'Test Product', price: 100 }],
        total: 100
      });

    const res = await request(app)
      .get('/api/orders/Test%20User')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].user).toBe('Test User');
  });
});