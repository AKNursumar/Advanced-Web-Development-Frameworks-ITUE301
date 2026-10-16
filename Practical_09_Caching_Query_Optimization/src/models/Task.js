const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [120, 'Task title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: "Priority must be 'low', 'medium', or 'high'"
      },
      default: 'medium',
      lowercase: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

taskSchema.pre('save', function (next) {
  if (this.title) {
    this.title = this.title.trim();
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
