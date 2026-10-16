const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../src/app');
const Task = require('../src/models/Task');
const { registerTaskListeners, eventAuditLog } = require('../src/events/taskListeners');

const TEST_MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_tasks_practical10_test';

let app;

beforeAll(async () => {
  await mongoose.connect(TEST_MONGO_URI);
  // Configure listeners with a small 200ms delay for automated test speed
  registerTaskListeners({ simulateDelay: false });
  app = createApp();
});

afterAll(async () => {
  await Task.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Task.deleteMany({});
  eventAuditLog.length = 0;
});

describe('Practical 10: Event-Driven Processing Integration Tests', () => {
  test('POST /tasks responds with 201 immediately and emits task-created event', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Complete Distributed Systems Assignment',
        description: 'Prepare presentation slides for port optimization',
        priority: 'high',
        assignedUser: 'AK Nursumar'
      })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Complete Distributed Systems Assignment');
    expect(res.body.responseSentAt).toBeDefined();

    // Allow event loop to process the event
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Verify event audit log received task-created
    const createdLog = eventAuditLog.find((l) => l.event === 'task-created');
    expect(createdLog).toBeDefined();
    expect(createdLog.title).toBe('Complete Distributed Systems Assignment');
    expect(createdLog.assignedUser).toBe('AK Nursumar');
  });

  test('DELETE /tasks/:id removes task and emits task-deleted event', async () => {
    const task = await Task.create({
      title: 'Task to be deleted',
      description: 'Temporary task for testing audit deletion event',
      priority: 'low'
    });

    const res = await request(app).delete(`/tasks/${task._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Task to be deleted');

    // Allow event loop to process event
    await new Promise((resolve) => setTimeout(resolve, 50));

    const deletedLog = eventAuditLog.find((l) => l.event === 'task-deleted');
    expect(deletedLog).toBeDefined();
    expect(deletedLog.taskId).toBe(task._id.toString());
  });

  test('POST /api/events/trigger-error emits error event and is handled safely without crashing server', async () => {
    const res = await request(app)
      .post('/api/events/trigger-error')
      .send({ message: 'Simulated async worker failure' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const errorLog = eventAuditLog.find((l) => l.event === 'error');
    expect(errorLog).toBeDefined();
    expect(errorLog.errorMessage).toBe('Simulated async worker failure');
  });

  test('GET /api/events/logs returns the captured event audit log', async () => {
    await request(app)
      .post('/tasks')
      .send({ title: 'Audit Log Verification Task' })
      .set('Content-Type', 'application/json');

    await new Promise((resolve) => setTimeout(resolve, 50));

    const res = await request(app).get('/api/events/logs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });
});
