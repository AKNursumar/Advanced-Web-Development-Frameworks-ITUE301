const EventEmitter = require('events');

/**
 * Dedicated EventEmitter subclass for task lifecycle events
 */
class TaskEvents extends EventEmitter {}

// Singleton event emitter instance shared across routes and background listeners
const taskEvents = new TaskEvents();

module.exports = taskEvents;
