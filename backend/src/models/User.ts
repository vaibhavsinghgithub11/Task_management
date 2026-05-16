import mongoose, { Document, Schema, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types';

/**
 * User Interface
 * Defines the structure of a User document
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  generateToken(): string;
}

/**
 * User Document Type
 * Hydrated document type for proper TypeScript support in middleware
 */
export type UserDocument = HydratedDocument<IUser>;

/**
 * User Schema
 * MongoDB schema for User collection
 */
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MEMBER
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true } // Include virtuals when converting to Object
  }
);

// Virtual field to add 'id' as an alias for '_id'
UserSchema.virtual('id').get(function(this: UserDocument) {
  return this._id.toHexString();
});

/**
 * Hash password before saving
 * Middleware that runs before save operation
 */
UserSchema.pre<UserDocument>('save', async function (next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare entered password with hashed password
 * Instance method available on user documents
 */
UserSchema.methods.matchPassword = async function (this: UserDocument, enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate JWT token
 * Instance method to create authentication token
 */
UserSchema.methods.generateToken = function (this: UserDocument): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(
    { id: this._id.toString(), role: this.role },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRE || '7d' } as jwt.SignOptions
  );
};

export default mongoose.model<IUser>('User', UserSchema);
