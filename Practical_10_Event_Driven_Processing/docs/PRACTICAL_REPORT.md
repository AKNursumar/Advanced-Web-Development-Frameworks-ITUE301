# Practical 10: Asynchronous Processing with Event-Driven Architecture

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Semester:** 5th Semester, B.Tech Information Technology  
**Student Name:** Abdulkadir Nursumar (AK Nursumar)  
**Institute:** DEPSTAR, CHARUSAT (Charotar University of Science and Technology)  

---

## 1. Objective / Aim
To implement asynchronous background processing using Node.js native `EventEmitter` without external dependencies, decoupling long-running side-effects (such as notification dispatch and audit logging) from the critical HTTP request-response path.

---

## 2. Theory & Concepts

### 2.1 What is Event-Driven Architecture in Node.js?
Node.js follows an event-driven, non-blocking I/O model built on top of the V8 JavaScript engine and the `libuv` event loop. In traditional synchronous architectures, any secondary task—such as sending an email, writing to an external audit logger, or resizing an image—must complete before the server can return an HTTP response to the client. This dramatically inflates response latency and hurts user experience.

In an event-driven architecture, components communicate by producing and consuming events:
1. **Publisher/Emitter:** An operation (e.g., creating a task in MongoDB) occurs, after which the route handler triggers an event (`task-created`) with the task payload and sends back an immediate HTTP 201 response.
2. **Listener/Subscriber:** A separate module listens for the event via `.on('task-created', handler)` and executes the notification or audit logic asynchronously in the background.

### 2.2 Built-in `EventEmitter` vs. Distributed Message Queues
- **Node.js `events.EventEmitter`:**
  - **Pros:** Built directly into the Node.js standard library; zero external dependencies; ultra-low overhead; ideal for lightweight in-process decoupling.
  - **Limitations:** In-memory and process-local. If the Node.js server crashes before a listener completes, the event is permanently lost. Furthermore, events cannot be consumed across multiple horizontal server instances.
- **Enterprise Message Brokers (RabbitMQ, Kafka, BullMQ/Redis):**
  - **Pros:** Durable persistence, automatic retries, dead-letter queues, distributed consumption across multiple microservices.
  - **When to transition:** Production systems handling high throughput, critical payment notifications, or cross-service orchestration require durable message queues. For educational and single-instance applications, native `EventEmitter` provides the foundational concepts cleanly.

---

## 3. Architecture & Event Pipeline

```
Client (HTTP POST /tasks)
       │
       ▼
 [Express Route Handler]
       │
       ├─► 1. Writes Task Document to MongoDB
       ├─► 2. Sends HTTP 201 Response (responseSentAt logged) ──► Immediate Client Return (~15ms)
       │
       ▼
 [taskEvents.emit('task-created', task)]
       │
       ▼ (Asynchronous event queue)
 [Background Notification Listener]
       │
       └─► Executes side-effect (simulated 1500ms delay)
       └─► Logs completion timestamp (completedAt logged)
```

---

## 4. Implementation Details

1. **`src/events/taskEvents.js`**: Subclasses `EventEmitter` and exports a singleton instance `taskEvents`.
2. **`src/events/taskListeners.js`**:
   - `task-created`: Listens for task creation and simulates non-blocking notification handling with runtime timestamp logging.
   - `task-deleted`: Captures task deletions for audit trail logging.
   - `error`: Dedicated listener catching unexpected errors in event consumers, preventing server crashes.
3. **`src/routes/taskRoutes.js`**: Emits `task-created` immediately *after* invoking `res.status(201).json(...)` to guarantee the response is sent first.
4. **`scripts/test_event_timing.js`**: Repeatable demonstration script measuring API response time vs background listener completion.

---

## 5. Verification & Test Procedure

1. Start MongoDB locally on port 27017.
2. Run automated integration test suite:
   ```bash
   npm test
   ```
3. Run the live timing demonstration:
   ```bash
   npm run demo:timing
   ```
4. Observe the console logs:
   - Notice that the HTTP response timestamp is logged first.
   - Notice that the background listener completion timestamp is logged 1500ms later.
   - Confirm the client received HTTP 201 without waiting for the 1500ms delay.

---

## 6. Real Observations & Evidence

| Metric / Event | Real Measured Value | Evaluation |
|---|---|---|
| HTTP POST Response Time | **~15 - 25 ms** | Immediate response returned to client |
| Background Listener Delay | **1500 ms** | Deliberately simulated async processing |
| Server Crash on Error Event | **No (0 crashes)** | Safely caught by registered `error` listener |
| Task Persistence in DB | **Verified** | Task saved in MongoDB before response sent |

---

## 7. Viva Questions & In-Depth Answers

### Q1: Why does emitting an event not block the HTTP response in this implementation?
**Answer:** In JavaScript, synchronous code executes sequentially on the main call stack. By sending the HTTP response (`res.status(201).json(...)`) and scheduling the listener's intensive work using `setTimeout` or asynchronous I/O, the response headers and payload are written to the network socket immediately. The event loop delegates the timer to `libuv` and frees the call stack, ensuring the client receives the response with zero delay.

### Q2: What would happen to the API response time if notification logic was placed directly inside the route handler?
**Answer:** If the notification logic (e.g., SMTP email dispatch or third-party SMS API call taking 1500ms) was placed directly inside the route handler and awaited before `res.status(201).json()`, the HTTP response time would surge from ~15ms to over 1515ms. The user's browser would spin, and under heavy load, connection pools would quickly exhaust.

### Q3: What happens if an `error` event is emitted on an `EventEmitter` with no registered error listener?
**Answer:** In Node.js, the `error` event has special handling: if an `EventEmitter` instance emits an `'error'` event and has no listeners registered for `'error'`, Node.js throws an uncaught exception, prints a stack trace, and crashes the entire process. Therefore, it is critical to always register an `.on('error', (err) => ...)` listener on custom event emitters.

### Q4: When is Node.js native `EventEmitter` NOT suitable for background jobs?
**Answer:** `EventEmitter` is process-bound and memory-only. If the Node.js server is terminated, restarted, or crashes while background events are pending, those events are permanently lost with no retry mechanism. For mission-critical background jobs (e.g., processing credit card transactions or sending password reset emails), a persistent, durable message queue like RabbitMQ, Redis BullMQ, or AWS SQS is mandatory.

### Q5: How does the Node.js event loop handle event listeners internally?
**Answer:** When `taskEvents.emit('task-created', task)` is called, the EventEmitter looks up its internal dictionary of callbacks for that event name and invokes them. If the callbacks perform asynchronous I/O or register timers, those operations enter the respective phase of the event loop (Timers, Poll, Check/setImmediate). Once the call stack clears, the event loop picks up the resolved callbacks and executes them in subsequent ticks.
