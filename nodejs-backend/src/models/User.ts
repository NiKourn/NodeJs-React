import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the User model
export interface IUsers extends Document {
	name: string;
	email: string;
	age?: number; // Optional field
}

// Define the schema
const userSchema: Schema<IUsers> = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	age: { type: Number, required: false },
});

// Create and export the model
export const Users = mongoose.model<IUsers>('Users', userSchema);
