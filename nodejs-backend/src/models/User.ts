import mongoose, { Schema, Document } from 'mongoose';
import { IUsers } from './interface/user';

// Define the schema
const userSchema: Schema<IUsers> = new Schema({
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	details: { type: Object, required: false },
});

// Create and export the model
export const Users = mongoose.model<IUsers>('Users', userSchema);
