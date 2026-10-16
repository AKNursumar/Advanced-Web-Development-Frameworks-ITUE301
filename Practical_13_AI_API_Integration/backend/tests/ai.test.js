const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../src/app');
const Task = require('../src/models/Task');

const TEST_MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_tasks_practical13_test';

let app;

beforeAll(async () => {
  await mongoose.connect(TEST_MONGO_URI);
  app = createApp();
});

afterAll(async () => {
  await Task.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe('Practical 13: AI Integration & Task Management Tests', () => {
  test('GET /api/ai/status returns provider info and strict privacy policy without exposing secrets', async () => {
    const res = await request(app).get('/api/ai/status');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.provider).toBeDefined();
    expect(res.body.privacyPolicy).toContain('Only task title is sent');
    expect(res.body.apiKey).toBeUndefined(); // Guarantees secrets are never leaked
  });

  test('POST /api/ai/generate-description rejects titles shorter than 3 characters with 400', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'Hi' })
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Validation Error');
  });

  test('POST /api/ai/generate-description gracefully handles unconfigured API key without server crash', async () => {
    // Unset keys for this test to verify graceful fallback
    const origGemini = process.env.GEMINI_API_KEY;
    const origOpenAI = process.env.OPENAI_API_KEY;
    process.env.GEMINI_API_KEY = '';
    process.env.OPENAI_API_KEY = '';

    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'Design database index strategy for analytics' })
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.fallback).toBe(true);
    expect(res.body.message).toContain('AI suggestion disabled');

    // Restore
    process.env.GEMINI_API_KEY = origGemini;
    process.env.OPENAI_API_KEY = origOpenAI;
  });

  test('POST /tasks persists task in MongoDB with isAiGenerated flag', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Implement Port Optimization Congestion Forecasting',
        description: 'Predict ship wait times using AIS vessel tracking stream data',
        priority: 'high',
        isAiGenerated: true
      })
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isAiGenerated).toBe(true);
    expect(res.body.data.title).toBe('Implement Port Optimization Congestion Forecasting');

    const inDb = await Task.findById(res.body.data._id);
    expect(inDb).not.toBeNull();
    expect(inDb.isAiGenerated).toBe(true);
  });

  test('AI rate limiter responds with 429 when threshold exceeded', async () => {
    process.env.AI_RATE_LIMIT_PER_MINUTE = '2';

    // Request 1
    await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'Task title 1' });

    // Request 2
    await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'Task title 2' });

    // Request 3 (should exceed limit of 2)
    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'Task title 3' });

    expect(res.statusCode).toBe(429);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Too Many Requests');

    // Reset limit
    process.env.AI_RATE_LIMIT_PER_MINUTE = '5';
  });
});
