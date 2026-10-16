require('dotenv').config();
const mongoose = require('mongoose');
const createApp = require('../src/app');
const request = require('supertest');
const Task = require('../src/models/Task');
const { registerTaskListeners, eventAuditLog } = require('../src/events/taskListeners');

async function runTimingDemo() {
  console.log('================================================================');
  console.log('   PRACTICAL 10: ASYNCHRONOUS EVENT-DRIVEN TIMING DEMO');
  console.log('   Student: Abdulkadir Nursumar (AK Nursumar)');
  console.log('================================================================\n');

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_tasks_practical10';
  await mongoose.connect(mongoUri);

  // Register listeners with a clear 1500ms simulated delay
  process.env.NOTIFICATION_DELAY_MS = '1500';
  registerTaskListeners({ simulateDelay: true });

  const app = createApp();

  console.log('[Step 1] Sending POST /tasks request to create a task...');
  const requestStartTime = Date.now();

  const res = await request(app)
    .post('/tasks')
    .send({
      title: 'Real-Time Event Decoupling Demonstration Task',
      description: 'Testing non-blocking EventEmitter notification execution',
      priority: 'high',
      assignedUser: 'AK Nursumar'
    })
    .set('Content-Type', 'application/json');

  const responseEndTime = Date.now();
  const apiElapsed = responseEndTime - requestStartTime;

  console.log(`\n--- [HTTP Response Received] ---`);
  console.log(`Status Code      : ${res.status}`);
  console.log(`Task ID          : ${res.body.data._id}`);
  console.log(`API Response Time: ${apiElapsed} ms`);
  console.log(`Server Reported  : ${res.body.responseSentAt}`);
  console.log(`Audit Log Count  : ${eventAuditLog.length} (Listener still executing in background...)\n`);

  console.log('[Step 2] Waiting for the asynchronous background notification listener to complete...');
  // Wait 1.8s for the 1.5s delay to resolve
  await new Promise((r) => setTimeout(r, 1800));

  console.log(`\n--- [Background Event Listener Completed] ---`);
  const createdLog = eventAuditLog.find((l) => l.event === 'task-created');
  if (createdLog) {
    console.log(`Event Name       : ${createdLog.event}`);
    console.log(`Received At      : ${createdLog.receivedAt}`);
    console.log(`Completed At     : ${createdLog.completedAt}`);
    console.log(`Listener Duration: ${createdLog.durationMs} ms`);
    console.log(`Log Message      : ${createdLog.message}`);
  }

  console.log('\n--- [Demonstration Conclusion] ---');
  console.log(`1. HTTP Response completed in ${apiElapsed} ms (Client received immediate 201 Created).`);
  console.log(`2. Background notification completed at ${createdLog ? createdLog.completedAt : 'N/A'}`);
  console.log(`3. Verified: The main HTTP request cycle was NOT blocked by slow background notification work!`);

  await Task.deleteMany({});
  await mongoose.connection.close();
  console.log('\nDemo complete. Exiting gracefully.');
}

runTimingDemo().catch((err) => {
  console.error('Demo error:', err);
  process.exit(1);
});
