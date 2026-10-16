const taskEvents = require('./taskEvents');

// Audit/event log history for verification and inspection
const eventAuditLog = [];

/**
 * Register background event listeners
 * @param {Object} options
 * @param {boolean} options.simulateDelay - whether to add artificial delay to prove non-blocking execution
 */
function registerTaskListeners(options = { simulateDelay: true }) {
  // Clear any previous listeners to avoid duplicate firing during test runs
  taskEvents.removeAllListeners();

  // 1. Task Created Listener (Asynchronous Notification)
  taskEvents.on('task-created', (task) => {
    const receivedAt = new Date();
    const delay = options.simulateDelay
      ? parseInt(process.env.NOTIFICATION_DELAY_MS || '1500', 10)
      : 0;

    // Simulate async processing (e.g., email notification, push alert, search indexing)
    setTimeout(() => {
      const completedAt = new Date();
      const logEntry = {
        event: 'task-created',
        taskId: task._id ? task._id.toString() : null,
        title: task.title,
        assignedUser: task.assignedUser || 'Unassigned',
        receivedAt: receivedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs: completedAt - receivedAt,
        message: `[Notification Listener] Task "${task.title}" notification processed at ${completedAt.toISOString()} (Assigned: ${task.assignedUser || 'Unassigned'})`
      };

      eventAuditLog.push(logEntry);
      console.log(logEntry.message);
    }, delay);
  });

  // 2. Task Deleted Listener (Audit & Cleanup Log)
  taskEvents.on('task-deleted', (task) => {
    const deletedAt = new Date();
    const logEntry = {
      event: 'task-deleted',
      taskId: task._id ? task._id.toString() : null,
      title: task.title,
      deletedAt: deletedAt.toISOString(),
      message: `[Audit Listener] Task "${task.title}" (ID: ${task._id}) deleted and archived at ${deletedAt.toISOString()}`
    };

    eventAuditLog.push(logEntry);
    console.log(logEntry.message);
  });

  // 3. Error Event Listener (Safe exception handling without crashing the process)
  taskEvents.on('error', (err) => {
    const errorAt = new Date();
    const logEntry = {
      event: 'error',
      errorMessage: err.message,
      timestamp: errorAt.toISOString(),
      message: `[Event Error Listener] Handled error safely without server crash: ${err.message}`
    };

    eventAuditLog.push(logEntry);
    console.error(logEntry.message);
  });
}

// Register listeners on module load
registerTaskListeners({ simulateDelay: true });

module.exports = {
  registerTaskListeners,
  eventAuditLog
};
