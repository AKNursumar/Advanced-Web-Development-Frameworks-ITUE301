const request = require('supertest');
const { createApp } = require('../src/app');
const taskController = require('../src/controllers/taskController');

describe('Task Management REST API Endpoints (Practical 4)', () => {
  let app;

  beforeEach(() => {
    // Reset in-memory store before each test for test isolation
    taskController._resetTasks();
    app = createApp();
  });

  describe('GET /', () => {
    it('should return API metadata and 200 status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.author).toBe('Abdulkadir Nursumar');
    });
  });

  describe('GET /tasks', () => {
    it('should return empty task list initially with 200 status', async () => {
      const res = await request(app).get('/tasks');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task with 201 status when payload is valid', async () => {
      const payload = {
        title: 'Complete Practical 4 Lab Report',
        description: 'Document REST API middleware pipeline and test cases',
        priority: 'high'
      };

      const res = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.description).toBe(payload.description);
      expect(res.body.data.priority).toBe('high');
      expect(res.body.data.completed).toBe(false);
      expect(res.body.data.id).toBeDefined();
    });

    it('should reject requests without Content-Type: application/json with 400', async () => {
      const res = await request(app)
        .post('/tasks')
        .send('title=PlainTextTask');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Bad Request');
    });

    it('should reject task creation with missing title with 400', async () => {
      const res = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send({ description: 'No title provided' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation Error');
    });

    it('should reject invalid priority enum value with 400', async () => {
      const res = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send({ title: 'Task with invalid priority', priority: 'ultra-urgent' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Priority must be one of/);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should retrieve a task by valid ID with 200 status', async () => {
      const createRes = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send({ title: 'Test Task' });

      const taskId = createRes.body.data.id;

      const res = await request(app).get(`/tasks/${taskId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(taskId);
      expect(res.body.data.title).toBe('Test Task');
    });

    it('should return 404 when task ID does not exist', async () => {
      const res = await request(app).get('/tasks/non-existent-id-999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not Found');
    });

    it('should return 400 when task ID format is invalid', async () => {
      const res = await request(app).get('/tasks/invalid%20id%20with%20spaces%21');
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid ID Format');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update an existing task with 200 status', async () => {
      const createRes = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send({ title: 'Initial Task', completed: false });

      const taskId = createRes.body.data.id;

      const updateRes = await request(app)
        .put(`/tasks/${taskId}`)
        .set('Content-Type', 'application/json')
        .send({ title: 'Updated Task Title', completed: true });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.success).toBe(true);
      expect(updateRes.body.data.title).toBe('Updated Task Title');
      expect(updateRes.body.data.completed).toBe(true);
    });

    it('should return 404 when updating non-existent task', async () => {
      const res = await request(app)
        .put('/tasks/fake-id-404')
        .set('Content-Type', 'application/json')
        .send({ title: 'New Title' });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete an existing task and return 200 status', async () => {
      const createRes = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send({ title: 'Task to be deleted' });

      const taskId = createRes.body.data.id;

      const deleteRes = await request(app).delete(`/tasks/${taskId}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);
      expect(deleteRes.body.data.id).toBe(taskId);

      // Verify task no longer exists
      const getRes = await request(app).get(`/tasks/${taskId}`);
      expect(getRes.status).toBe(404);
    });

    it('should return 404 when attempting to delete non-existent task', async () => {
      const res = await request(app).delete('/tasks/fake-id-404');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });
  });

  describe('404 Undefined Route Handler', () => {
    it('should return structured 404 JSON for unknown routes', async () => {
      const res = await request(app).get('/api/unregistered/path');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not Found');
    });
  });
});
