/**
 * Repeatable Caching Benchmark Script
 * Practical 9: In-Memory Caching and Query Optimization
 * 
 * Measures genuine, actual round-trip HTTP request timings:
 * - 3 samples UNCACHED (direct MongoDB reads via ?cache=false)
 * - 3 samples CACHED (in-memory retrieval from node-cache)
 * Records and displays actual measured milliseconds.
 */

const http = require('http');
const { performance } = require('perf_hooks');
const { createApp } = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const Task = require('../src/models/Task');
const cache = require('../src/utils/cache');

function makeRequest(server, path) {
  const address = server.address();
  const options = {
    hostname: '127.0.0.1',
    port: address.port,
    path: path,
    method: 'GET'
  };

  return new Promise((resolve, reject) => {
    const start = performance.now();
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        const duration = performance.now() - start;
        const cacheHeader = res.headers['x-cache'] || 'NONE';
        resolve({
          statusCode: res.statusCode,
          cacheHeader,
          durationMs: parseFloat(duration.toFixed(2))
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

async function runBenchmark() {
  console.log('===============================================================');
  console.log('   PRACTICAL 9: LIVE IN-MEMORY CACHING BENCHMARK MEASUREMENT   ');
  console.log('   Student: Abdulkadir Nursumar | DEPSTAR, CHARUSAT            ');
  console.log('===============================================================\n');

  await connectDB();
  const app = createApp();

  // Seed sample tasks to ensure meaningful dataset for timing
  const existingCount = await Task.countDocuments();
  if (existingCount < 5) {
    console.log(`Seeding sample tasks for benchmark test...`);
    for (let i = 1; i <= 5; i++) {
      await Task.create({
        title: `Benchmark Task #${i} for Latency Evaluation`,
        description: `Synthetic task record generated for timing measurement`,
        priority: i % 2 === 0 ? 'high' : 'medium'
      });
    }
  }

  const server = app.listen(0); // Bind ephemeral port
  const port = server.address().port;
  console.log(`Test server running on port: ${port}\n`);

  try {
    // 1. Measure 3 Uncached Readings (?cache=false bypass)
    console.log('--- CONDITION A: UNCACHED (Direct MongoDB Query) ---');
    const uncachedReadings = [];
    for (let i = 1; i <= 3; i++) {
      const res = await makeRequest(server, '/tasks?cache=false');
      uncachedReadings.push(res.durationMs);
      console.log(`  Sample ${i}: ${res.durationMs} ms (X-Cache: ${res.cacheHeader}, HTTP ${res.statusCode})`);
    }

    // 2. Prime cache
    cache.flush();
    console.log('\n--- CONDITION B: CACHED (In-Memory node-cache) ---');
    console.log('Priming cache (cold start)...');
    const priming = await makeRequest(server, '/tasks');
    console.log(`  Cold Fetch: ${priming.durationMs} ms (X-Cache: ${priming.cacheHeader})`);

    // 3. Measure 3 Cached Readings
    const cachedReadings = [];
    for (let i = 1; i <= 3; i++) {
      const res = await makeRequest(server, '/tasks');
      cachedReadings.push(res.durationMs);
      console.log(`  Sample ${i}: ${res.durationMs} ms (X-Cache: ${res.cacheHeader}, HTTP ${res.statusCode})`);
    }

    // Summary calculations
    const avgUncached = (uncachedReadings.reduce((a, b) => a + b, 0) / uncachedReadings.length).toFixed(2);
    const avgCached = (cachedReadings.reduce((a, b) => a + b, 0) / cachedReadings.length).toFixed(2);

    console.log('\n===============================================================');
    console.log('                    ACTUAL MEASURED RESULTS                    ');
    console.log('===============================================================');
    console.log(`Uncached Latency Readings: [${uncachedReadings.join(' ms, ')} ms]`);
    console.log(`Average Uncached Latency:  ${avgUncached} ms`);
    console.log(`Cached Latency Readings:   [${cachedReadings.join(' ms, ')} ms]`);
    console.log(`Average Cached Latency:    ${avgCached} ms`);

    const stats = cache.getStats();
    console.log(`Cache Hit Ratio:           ${stats.hitRatio} (${stats.hits} hits / ${stats.misses} misses)`);
    console.log('===============================================================\n');
  } finally {
    server.close();
    await disconnectDB();
  }
}

runBenchmark().catch((err) => {
  console.error('Benchmark error:', err);
  process.exit(1);
});
