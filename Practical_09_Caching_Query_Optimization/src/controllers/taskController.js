const Task = require('../models/Task');
const cache = require('../utils/cache');

const ALL_TASKS_CACHE_KEY = 'all_tasks';
const getTaskCacheKey = (id) => `task_${id}`;

/**
 * GET /tasks
 * Checks cache first. If hit, returns cached data with X-Cache: HIT.
 * If miss (or ?cache=false is supplied), queries MongoDB, populates cache, returns X-Cache: MISS.
 */
async function getAllTasks(req, res, next) {
  try {
    const bypassCache = req.query.cache === 'false';

    if (!bypassCache) {
      const cached = cache.get(ALL_TASKS_CACHE_KEY);
      if (cached !== undefined) {
        res.set('X-Cache', 'HIT');
        return res.status(200).json({
          success: true,
          source: 'cache',
          count: cached.length,
          data: cached
        });
      }
    }

    // Cache MISS or bypassed: Query MongoDB
    const tasks = await Task.find().sort({ createdAt: -1 });

    if (!bypassCache) {
      cache.set(ALL_TASKS_CACHE_KEY, tasks);
    }

    res.set('X-Cache', bypassCache ? 'BYPASS' : 'MISS');
    res.status(200).json({
      success: true,
      source: bypassCache ? 'database (bypassed)' : 'database (cached)',
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /tasks/:id
 * Supplementary requirement: caches single task separately under distinct key.
 */
async function getTaskById(req, res, next) {
  try {
    const bypassCache = req.query.cache === 'false';
    const cacheKey = getTaskCacheKey(req.params.id);

    if (!bypassCache) {
      const cached = cache.get(cacheKey);
      if (cached !== undefined) {
        res.set('X-Cache', 'HIT');
        return res.status(200).json({
          success: true,
          source: 'cache',
          data: cached
        });
      }
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Task with ID '${req.params.id}' not found.`
      });
    }

    if (!bypassCache) {
      cache.set(cacheKey, task);
    }

    res.set('X-Cache', bypassCache ? 'BYPASS' : 'MISS');
    res.status(200).json({
      success: true,
      source: bypassCache ? 'database (bypassed)' : 'database (cached)',
      data: task
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /tasks
 * Invalidates 'all_tasks' cache key after creating task in MongoDB.
 */
async function createTask(req, res, next) {
  try {
    const { title, description, priority } = req.body;

    const task = await Task.create({
      title,
      description,
      priority
    });

    // Invalidate list cache
    cache.del(ALL_TASKS_CACHE_KEY);

    res.status(201).json({
      success: true,
      message: 'Task created and cache invalidated',
      data: task
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /tasks/:id
 * Invalidates both 'all_tasks' and the specific 'task_:id' cache keys.
 */
async function updateTask(req, res, next) {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Task not found'
      });
    }

    // Invalidate caches
    cache.del(ALL_TASKS_CACHE_KEY);
    cache.del(getTaskCacheKey(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Task updated and cache invalidated',
      data: task
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /tasks/:id
 * Invalidates both 'all_tasks' and 'task_:id' cache keys.
 */
async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Task not found'
      });
    }

    // Invalidate caches
    cache.del(ALL_TASKS_CACHE_KEY);
    cache.del(getTaskCacheKey(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Task deleted and cache invalidated',
      data: task
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/cache/stats
 * Supplementary requirement: exposes cache hits, misses, hit ratio, active keys count.
 */
function getCacheStats(req, res) {
  res.status(200).json({
    success: true,
    stats: cache.getStats()
  });
}

/**
 * POST /api/cache/flush
 * Flushes all cached keys.
 */
function flushCache(req, res) {
  cache.flush();
  res.status(200).json({
    success: true,
    message: 'Cache flushed successfully'
  });
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getCacheStats,
  flushCache,
  ALL_TASKS_CACHE_KEY,
  getTaskCacheKey
};
