const request = require('supertest');
const mongoose = require('mongoose');
const { createApp } = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const Task = require('../src/models/Task');

describe('Task Management MongoDB / Mongoose API (Practical 5)', () => {
  let app;
  const TEST_MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_tasks_practical5_test';

  beforeAll(async () => {
    await connectDB(TEST_MONGO_URI);
    app = createApp();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await Task.deleteMany({});
      await disconnectDB();
    }
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  describe('GET /', () => {
    it('should return server metadata and 200 status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.author).toBe('Abdulkadir Nursumar');
      expect(res.body.database).toBe('MongoDB with Mongoose ODM');
    });
  });

  describe('GET /tasks', () => {
    it('should return empty list initially with 200 status', async () => {
      const res = await request(app).get('/tasks');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /tasks', () => {
    it('should create and persist a new task document in MongoDB with 201 status', async () => {
      const payload = {
        title: 'Configure Mongoose Task Schema',
        description: 'Implement required validation, priority enum, and timestamps',
        priority: 'high'
      };

      const res = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBeDefined();
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.description).toBe(payload.description);
      expect(res.body.data.priority).toBe('high');
      expect(res.body.data.completed).toBe(false);

      // Verify persistence directly in MongoDB
      const foundInDb = await Task.findById(res.body.data._id);
      expect(foundInDb).not.toBeNull();
      expect(foundInDb.title).toBe(payload.title);
    });

    it('should trim title whitespace using pre-save hook', async () => {
      const res = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send({ title: '   Trimmed Task Title   ' });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Trimmed Task Title');
    });

    it('should reject task creation with missing title and return 400 validation error', async () => {
      const res = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send({ description: 'No title given' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation Error');
      expect(res.body.message).toMatch(/Task title is required/);
    });

    it('should reject invalid priority enum value and return 400', async () => {
      const res = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send({ title: 'Valid Title', priority: 'extreme-priority' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Priority must be either/);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should retrieve a task by valid MongoDB ObjectId with 200 status', async () => {
      const created = await Task.create({ title: 'MongoDB Query Test' });

      const res = await request(app).get(`/tasks/${created._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(created._id.toString());
      expect(res.body.data.title).toBe('MongoDB Query Test');
    });

    it('should return 400 when task ID is not a valid MongoDB ObjectId', async () => {
      const res = await request(app).get('/tasks/invalid-mongo-id-123');
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid ID Format');
    });

    it('should return 404 when valid ObjectId does not exist in collection', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/tasks/${nonExistentId}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update an existing task in MongoDB and return 200 status', async () => {
      const created = await Task.create({ title: 'Initial MongoDB Task', completed: false });

      const res = await request(app)
        .put(`/tasks/${created._id}`)
        .set('Content-Type', 'application/json')
        .send({ title: 'Updated Title', completed: true });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.completed).toBe(true);

      const updatedInDb = await Task.findById(created._id);
      expect(updatedInDb.completed).toBe(true);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete task document from MongoDB and return 200 status', async () => {
      const created = await Task.create({ title: 'Task to be removed' });

      const res = await request(app).delete(`/tasks/${created._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const checkDb = await Task.findById(created._id);
      expect(checkDb).toBeNull();
    });
  });
});
