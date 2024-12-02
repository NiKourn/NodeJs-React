// src/models/User.js
import mongoose from 'mongoose';

// Define a user schema
const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
