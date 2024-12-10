import mongoose, { Schema } from 'mongoose';
import { IUsers } from './interface/types';

// Define the schema
const userSchema: Schema<IUsers> = new Schema({
	password: { type: String, required: true },
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	details: { type: Object, required: false },
});

// Create and export the model
export const Users = mongoose.model<IUsers>('Users', userSchema);
