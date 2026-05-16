import mongoose, { Document, Schema } from 'mongoose';

/**
 * Project Interface
 * Defines the structure of a Project document
 */
export interface IProject extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project Schema
 * MongoDB schema for Project collection
 */
const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project must have a creator']
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

/**
 * Index for faster queries
 */
ProjectSchema.index({ createdBy: 1 });
ProjectSchema.index({ members: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
