# Practical 10: Verification Record

**Date:** 2026-10-16  
**Student:** Abdulkadir Nursumar (AK Nursumar)  
**System:** Windows PowerShell, Node.js v22.17.0, npm 11.5.2, MongoDB v7.0.14  

---

## 1. Automated Integration Test Suite Run

Command executed:
```bash
npm test
```

Actual Terminal Output:
```
> practical-10-event-driven-processing@1.0.0 test
> jest --runInBand --detectOpenHandles --forceExit

  console.log
    [HTTP Request] POST /tasks - 2026-10-16T09:48:24.500Z
    [API] Response sent at 2026-10-16T09:48:24.547Z
    [Notification Listener] Task "Complete Distributed Systems Assignment" notification processed at 2026-10-16T09:48:24.558Z (Assigned: AK Nursumar)
    [HTTP Request] DELETE /tasks/6ad1f2e8e94638522a2fc8bc - 2026-10-16T09:48:24.648Z
    [API] Delete response sent at 2026-10-16T09:48:24.664Z
    [Audit Listener] Task "Task to be deleted" (ID: 6ad1f2e8e94638522a2fc8bc) deleted and archived at 2026-10-16T09:48:24.667Z
    [HTTP Request] POST /api/events/trigger-error - 2026-10-16T09:48:24.751Z
    [Event Error Listener] Handled error safely without server crash: Simulated async worker failure
    [HTTP Request] POST /tasks - 2026-10-16T09:48:24.783Z
    [API] Response sent at 2026-10-16T09:48:24.798Z
    [Notification Listener] Task "Audit Log Verification Task" notification processed at 2026-10-16T09:48:24.803Z (Assigned: AK Nursumar)
    [HTTP Request] GET /api/events/logs - 2026-10-16T09:48:24.868Z

PASS tests/events.test.js (10.41 s)
  Practical 10: Event-Driven Processing Integration Tests
    √ POST /tasks responds with 201 immediately and emits task-created event (328 ms)
    √ DELETE /tasks/:id removes task and emits task-deleted event (108 ms)
    √ POST /api/events/trigger-error emits error event and is handled safely without crashing server (28 ms)
    √ GET /api/events/logs returns the captured event audit log (111 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        10.834 s
Ran all test suites.
```

---

## 2. Real-Time Asynchronous Timing Demonstration Run

Command executed:
```bash
npm run demo:timing
```

Actual Terminal Output:
```
> practical-10-event-driven-processing@1.0.0 demo:timing
> node scripts/test_event_timing.js

================================================================
   PRACTICAL 10: ASYNCHRONOUS EVENT-DRIVEN TIMING DEMO
   Student: Abdulkadir Nursumar (AK Nursumar)
================================================================

[Step 1] Sending POST /tasks request to create a task...
[HTTP Request] POST /tasks - 2026-10-16T09:48:46.716Z
[API] Response sent at 2026-10-16T09:48:46.779Z

--- [HTTP Response Received] ---
Status Code      : 201
Task ID          : 6ad1f2fe7dc3f41dbbaede5a
API Response Time: 103 ms
Server Reported  : 2026-10-16T09:48:46.779Z
Audit Log Count  : 0 (Listener still executing in background...)

[Step 2] Waiting for the asynchronous background notification listener to complete...
[Notification Listener] Task "Real-Time Event Decoupling Demonstration Task" notification processed at 2026-10-16T09:48:48.285Z (Assigned: AK Nursumar)

--- [Background Event Listener Completed] ---
Event Name       : task-created
Received At      : 2026-10-16T09:48:46.782Z
Completed At     : 2026-10-16T09:48:48.285Z
Listener Duration: 1503 ms
Log Message      : [Notification Listener] Task "Real-Time Event Decoupling Demonstration Task" notification processed at 2026-10-16T09:48:48.285Z (Assigned: AK Nursumar)

--- [Demonstration Conclusion] ---
1. HTTP Response completed in 103 ms (Client received immediate 201 Created).
2. Background notification completed at 2026-10-16T09:48:48.285Z
3. Verified: The main HTTP request cycle was NOT blocked by slow background notification work!

Demo complete. Exiting gracefully.
```

---

## Status: PASS
- All tests passed.
- Real timestamps verify decoupling: HTTP response sent at `09:48:46.779Z`, background listener finished 1503ms later at `09:48:48.285Z`.
