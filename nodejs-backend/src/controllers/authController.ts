import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Users } from '../models/User';
import jwt from 'jsonwebtoken';

/**
 * Register the user in the backend
 * @param req
 * @param res
 * @returns
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password, details } = req.body;

		// Check if user already exists
		const existingUser = await Users.findOne({ email });
		if (existingUser) {
			res.status(400).json({ message: 'User already exists' });
			return;
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create a new user
		const newUser = new Users({ email, password: hashedPassword, details });
		await newUser.save();

		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

/**
 * Log a user in the backend and return a JWT token
 * @param req
 * @param res
 * @returns
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;

		// Find the user
		const user = await Users.findOne({ email });
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		}

		// Verify the password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}

		// Generate a JWT token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
			expiresIn: process.env.JWT_EXPIRES_IN,
		});

		res.status(200).json({ message: 'Login successful', token, user });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};
