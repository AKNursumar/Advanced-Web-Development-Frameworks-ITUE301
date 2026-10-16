const NodeCache = require('node-cache');

/**
 * In-Memory Cache Wrapper using node-cache
 * Default TTL: 60 seconds (Configurable via CACHE_TTL env)
 * Check period: 120 seconds (Automatic eviction of expired keys)
 */
const DEFAULT_TTL = parseInt(process.env.CACHE_TTL || '60', 10);

const nodeCache = new NodeCache({
  stdTTL: DEFAULT_TTL,
  checkperiod: 120,
  useClones: false // Performance optimization for read-heavy payloads
});

let hitCount = 0;
let missCount = 0;

const cache = {
  get(key) {
    const value = nodeCache.get(key);
    if (value !== undefined) {
      hitCount++;
      return value;
    }
    missCount++;
    return undefined;
  },

  set(key, value, ttl = DEFAULT_TTL) {
    return nodeCache.set(key, value, ttl);
  },

  del(key) {
    return nodeCache.del(key);
  },

  flush() {
    hitCount = 0;
    missCount = 0;
    return nodeCache.flushAll();
  },

  getStats() {
    const total = hitCount + missCount;
    const hitRatio = total > 0 ? ((hitCount / total) * 100).toFixed(2) + '%' : '0.00%';
    const keys = nodeCache.keys();

    return {
      hits: hitCount,
      misses: missCount,
      totalRequests: total,
      hitRatio,
      activeKeysCount: keys.length,
      activeKeys: keys,
      defaultTTLSeconds: DEFAULT_TTL,
      note: 'node-cache is process-local memory. Cache resets on server restart.'
    };
  },

  _raw: nodeCache
};

module.exports = cache;
