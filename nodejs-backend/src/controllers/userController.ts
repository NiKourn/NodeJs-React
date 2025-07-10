import { Request, Response } from 'express'
import { Users } from '@/models/user'

/**
 * Creates a single user to the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the user details or an error message.
 */
export const createUser = async (req: Request, res: Response) => {
	try {
		const { username, email, password, details } = req.body

		const newUser = await Users.create({ username, email, password, details })

		res.status(201).json(newUser)
	} catch (error) {
		res.status(500).json({ message: 'Error creating user', error })
	}
}

/**
 * Retrieves all users from the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the list of users or an error message.
 */
export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await Users.findAll()
		res.json(users)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching users', error })
	}
}

/**
 * Retrieves a single user from the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the user details or an error message.
 */
export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { userId } = req.query // Access the userId from query parameters
		if (!userId) {
			res.status(400).json({ message: 'User ID is required' })
			return
		}

		const user = await Users.delete(Number(userId))

		if (!user) {
			res.status(404).json({ message: 'User not found' })
			return
		}

		res.status(200).json({ message: 'User deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Server error', error })
	}
}
