const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../src/app');
const Task = require('../src/models/Task');

const TEST_MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_ci_test';

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

describe('Practical 12: CI/CD Pipeline Automated Integration Test Suite', () => {
  // =========================================================================
  // CI FAILURE DEMONSTRATION TOGGLE (Required for Lab File Submission):
  // To trigger a DELIBERATE RED FAILURE in GitHub Actions:
  // Change the expected status code below from 200 to 201:
  //   expect(res.statusCode).toBe(201); // <-- Breaks CI Pipeline with Red X
  // Commit and push. Inspect the Actions tab to observe the failure log.
  // Then revert back to 200 and push to turn the pipeline GREEN!
  // =========================================================================
  test('GET /tasks returns status 200 and task list', async () => {
    await Task.create({
      title: 'Automated CI Test Task',
      description: 'Verifying automated testing under GitHub Actions',
      priority: 'high'
    });

    const res = await request(app).get('/tasks');

    // Expected: 200 OK
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].title).toBe('Automated CI Test Task');
  });

  test('POST /tasks creates a new task with status 201', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'CI/CD Pipeline Deployment Test',
        description: 'Testing push triggers and build-and-test job',
        priority: 'medium'
      })
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('CI/CD Pipeline Deployment Test');
    expect(res.body.data._id).toBeDefined();
  });

  test('POST /tasks rejects empty title with status 400', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: '   ' })
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Validation Error');
  });

  test('GET /tasks/:id returns 404 for non-existent valid ObjectId', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/tasks/${nonExistentId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Task Not Found');
  });

  test('GET /unknown-route returns structured 404', async () => {
    const res = await request(app).get('/non-existent-api-route');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Not Found');
  });
});
