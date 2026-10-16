const request = require('supertest');
const mongoose = require('mongoose');
const { createApp } = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

describe('JWT Authentication & Middleware Pipeline Tests (Practical 7)', () => {
  let app;
  const TEST_MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_tasks_practical7_test';

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret_key_practical7';
    await connectDB(TEST_MONGO_URI);
    app = createApp();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await User.deleteMany({});
      await Task.deleteMany({});
      await disconnectDB();
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user, hash the password, and return a JWT', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Abdulkadir Nursumar',
          email: 'abdulkadir.nursumar@gmail.com',
          password: 'securePassword123'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('abdulkadir.nursumar@gmail.com');
      expect(res.body.user.password).toBeUndefined(); // Never expose password in response

      // Confirm in DB that password is not plain text
      const dbUser = await User.findOne({ email: 'abdulkadir.nursumar@gmail.com' });
      expect(dbUser).not.toBeNull();
      expect(dbUser.password).not.toBe('securePassword123');
      expect(dbUser.password.startsWith('$2')).toBe(true); // bcrypt prefix
    });

    it('should reject registration with duplicate email with 400', async () => {
      await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({
          name: 'First User',
          email: 'duplicate@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Second User',
          email: 'duplicate@example.com',
          password: 'password456'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/);
    });

    it('should reject password shorter than 6 characters with 400', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Short Pass',
          email: 'short@example.com',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/at least 6 characters/);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Auth Student',
          email: 'student@example.com',
          password: 'validPassword123'
        });
    });

    it('should login with correct credentials and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'student@example.com',
          password: 'validPassword123'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('student@example.com');
    });

    it('should reject login with wrong password with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'student@example.com',
          password: 'WRONG_PASSWORD'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Unauthorized');
    });

    it('should reject login with non-existent email with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'ghost@example.com',
          password: 'validPassword123'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile when given valid Bearer token', async () => {
      const regRes = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Profile User',
          email: 'profile@example.com',
          password: 'password123'
        });

      const token = regRes.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.name).toBe('Profile User');
      expect(res.body.user.email).toBe('profile@example.com');
      expect(res.body.user.password).toBeUndefined();
    });
  });

  describe('Protected Task Routes & Auth Middleware', () => {
    it('should reject requests without Authorization header with 401', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });

    it('should reject requests with invalid token format with 401', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', 'InvalidFormatHeader');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });

    it('should reject requests with forged token signature with 401', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', 'Bearer forged.tampered.token');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid Token');
    });
  });

  describe('User Data Isolation', () => {
    it('should isolate tasks so User B cannot see or manipulate User A tasks', async () => {
      // 1. Register User A
      const userARes = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({ name: 'User A', email: 'usera@example.com', password: 'passwordA' });
      const tokenA = userARes.body.token;

      // 2. Register User B
      const userBRes = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({ name: 'User B', email: 'userb@example.com', password: 'passwordB' });
      const tokenB = userBRes.body.token;

      // 3. User A creates a private task
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${tokenA}`)
        .set('Content-Type', 'application/json')
        .send({ title: 'User A Secret Task', priority: 'high' });

      const taskAId = createRes.body.data._id;
      expect(taskAId).toBeDefined();

      // 4. User B requests all tasks -> should be empty for User B
      const listResB = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(listResB.status).toBe(200);
      expect(listResB.body.count).toBe(0);
      expect(listResB.body.data.length).toBe(0);

      // 5. User B attempts to access User A task directly -> 404
      const getTaskResB = await request(app)
        .get(`/api/tasks/${taskAId}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(getTaskResB.status).toBe(404);

      // 6. User B attempts to delete User A task -> 404
      const deleteResB = await request(app)
        .delete(`/api/tasks/${taskAId}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(deleteResB.status).toBe(404);

      // 7. User A can still retrieve and delete their own task
      const getTaskResA = await request(app)
        .get(`/api/tasks/${taskAId}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(getTaskResA.status).toBe(200);
      expect(getTaskResA.body.data.title).toBe('User A Secret Task');
    });
  });
});
