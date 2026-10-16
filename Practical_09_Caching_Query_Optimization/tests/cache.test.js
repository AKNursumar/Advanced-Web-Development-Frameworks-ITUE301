const request = require('supertest');
const mongoose = require('mongoose');
const { createApp } = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const Task = require('../src/models/Task');
const cache = require('../src/utils/cache');

describe('In-Memory Caching & Query Optimization Tests (Practical 9)', () => {
  let app;
  const TEST_MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_tasks_practical9_test';

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
    cache.flush();
    await Task.deleteMany({});
  });

  describe('GET /tasks Caching Behavior', () => {
    it('should return X-Cache: MISS on cold start and X-Cache: HIT on subsequent request', async () => {
      await Task.create({ title: 'Cached Task A' });

      // First request: MISS
      const res1 = await request(app).get('/tasks');
      expect(res1.status).toBe(200);
      expect(res1.headers['x-cache']).toBe('MISS');
      expect(res1.body.source).toMatch(/database/);

      // Second request: HIT
      const res2 = await request(app).get('/tasks');
      expect(res2.status).toBe(200);
      expect(res2.headers['x-cache']).toBe('HIT');
      expect(res2.body.source).toBe('cache');
      expect(res2.body.data.length).toBe(1);
    });

    it('should bypass cache when ?cache=false is supplied', async () => {
      await Task.create({ title: 'Task B' });

      // Populate cache
      await request(app).get('/tasks');

      // Request with bypass
      const res = await request(app).get('/tasks?cache=false');
      expect(res.status).toBe(200);
      expect(res.headers['x-cache']).toBe('BYPASS');
      expect(res.body.source).toMatch(/bypassed/);
    });
  });

  describe('Cache Invalidation on Mutation', () => {
    it('should invalidate cache when a new task is created (POST /tasks)', async () => {
      await Task.create({ title: 'Initial Task' });

      // Prime cache
      await request(app).get('/tasks');
      expect(cache.get('all_tasks')).toBeDefined();

      // Create new task
      const postRes = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send({ title: 'Newly Created Task' });

      expect(postRes.status).toBe(201);

      // Cache should now be deleted
      expect(cache.get('all_tasks')).toBeUndefined();

      // Next GET should be a MISS
      const nextGet = await request(app).get('/tasks');
      expect(nextGet.headers['x-cache']).toBe('MISS');
      expect(nextGet.body.data.length).toBe(2);
    });

    it('should invalidate cache when a task is updated (PUT /tasks/:id)', async () => {
      const task = await Task.create({ title: 'Task to Update' });

      // Prime list and item cache
      await request(app).get('/tasks');
      await request(app).get(`/tasks/${task._id}`);
      expect(cache.get('all_tasks')).toBeDefined();
      expect(cache.get(`task_${task._id}`)).toBeDefined();

      // Update task
      const putRes = await request(app)
        .put(`/tasks/${task._id}`)
        .set('Content-Type', 'application/json')
        .send({ title: 'Updated Title' });

      expect(putRes.status).toBe(200);

      // Both caches should be invalidated
      expect(cache.get('all_tasks')).toBeUndefined();
      expect(cache.get(`task_${task._id}`)).toBeUndefined();
    });

    it('should invalidate cache when a task is deleted (DELETE /tasks/:id)', async () => {
      const task = await Task.create({ title: 'Task to Delete' });

      await request(app).get('/tasks');
      await request(app).get(`/tasks/${task._id}`);

      const delRes = await request(app).delete(`/tasks/${task._id}`);
      expect(delRes.status).toBe(200);

      expect(cache.get('all_tasks')).toBeUndefined();
      expect(cache.get(`task_${task._id}`)).toBeUndefined();
    });
  });

  describe('GET /api/cache/stats', () => {
    it('should report hits, misses, and hit ratio', async () => {
      await Task.create({ title: 'Stats Task' });

      // 1 miss, 1 hit
      await request(app).get('/tasks');
      await request(app).get('/tasks');

      const res = await request(app).get('/api/cache/stats');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats.hits).toBeGreaterThanOrEqual(1);
      expect(res.body.stats.misses).toBeGreaterThanOrEqual(1);
      expect(res.body.stats.defaultTTLSeconds).toBe(60);
    });
  });
});
