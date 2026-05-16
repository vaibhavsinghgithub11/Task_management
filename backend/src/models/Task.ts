import mongoose, { Document, Schema, HydratedDocument } from 'mongoose';
import { TaskStatus, TaskPriority } from '../types';

/**
 * Task Interface
 * Defines the structure of a Task document
 */
export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  assignedTo: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task Document Type
 * Hydrated document type for proper TypeScript support in middleware
 */
export type TaskDocument = HydratedDocument<ITask>;

/**
 * Task Schema
 * MongoDB schema for Task collection
 */
const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a task description'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a due date']
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please assign the task to a user']
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Task must belong to a project']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must have a creator']
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

/**
 * Indexes for faster queries
 */
TaskSchema.index({ project: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ dueDate: 1 });

/**
 * Pre-save middleware to check for overdue tasks
 */
TaskSchema.pre<TaskDocument>('save', function (next) {
  // If task is not completed and due date has passed, mark as overdue
  if (this.status !== TaskStatus.COMPLETED && new Date().getTime() > new Date(this.dueDate).getTime()) {
    this.status = TaskStatus.OVERDUE;
  }
  next();
});

export default mongoose.model<ITask>('Task', TaskSchema);
