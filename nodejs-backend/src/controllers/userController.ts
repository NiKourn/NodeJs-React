import { NextFunction, Request, Response } from 'express';
import { Users } from '../models/User';

// Fetch all users
export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await Users.find();
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching users', error });
	}
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
	try {
		const { name, email, age } = req.body;

		const newUser = new Users({ name, email, age });
		const savedUser = await newUser.save();

		res.status(201).json(savedUser);
	} catch (error) {
		res.status(500).json({ message: 'Error creating user', error });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { userId } = req.query; // Access the userId from query parameters
		if (!userId) {
			res.status(400).json({ message: 'User ID is required' });
		}

		const user = await Users.findByIdAndDelete(userId);

		if (!user) {
			res.status(404).json({ message: 'User not found' });
		}

		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};
