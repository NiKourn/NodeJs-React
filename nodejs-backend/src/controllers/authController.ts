import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { Users } from '../models/user'
import jwt from 'jsonwebtoken'

/**
 * Registers a new user by creating a new user document in the database.
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body

		// Generate username from email
		const username = email.split('@')[0]

		// Validate required fields
		if (!email || !password) {
			res.status(400).json({ message: 'Email and password are required', status: false })
			return
		}

		// Check if user already exists
		const existingUser = await Users.findByEmail(email)

		if (existingUser) {
			res.status(400).json({ message: 'User already exists with this email', status: false })
			return
		}

		// Check if username already exists
		const existingUsername = await Users.findByUsername(username)
		if (existingUsername) {
			res.status(400).json({ message: 'Username already exists, please use another email', status: false })
			return
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		// Create a new user
		const newUser = await Users.create({
			email,
			username,
			password: hashedPassword,
		})

		// Generate JWT token
		const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.JWT_SECRET || 'fallback_secret', {
			expiresIn: '7d',
		})

		// Return user data and token
		res.status(201).json({
			message: 'User registered successfully',
			user: {
				id: newUser.id,
				username: newUser.username,
				email: newUser.email,
				createdAt: newUser.createdAt,
				updatedAt: newUser.updatedAt,
			},
			token,
			status: true,
		})
	} catch (error) {
		console.error('Registration error:', error)
		res.status(500).json({ message: 'Server error', error, status: false })
	}
}

/**
 * Logs in a user by verifying their credentials and returns a JWT token.
 *
 * @param {Request} req - The HTTP request object containing the user's identifier (username or email) and password.
 * @param {Response} res - The HTTP response object used to send back the token and user information.
 * @returns {Promise<void>} Resolves when the function completes, sending the response to the client.
 *
 * body parameters: identifier, password
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { identifier, password } = req.body

		// Validate required fields
		if (!identifier || !password) {
			res.status(400).json({ message: 'Username/email and password are required', status: false })
			return
		}

		// Find user by email or username
		let user = await Users.findByEmail(identifier)
		if (!user) {
			user = await Users.findByUsername(identifier)
		}

		if (!user) {
			res.status(401).json({ message: 'Invalid username/email or password', status: false })
			return
		}

		// Verify the password
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			res.status(401).json({ message: 'Invalid username/email or password', status: false })
			return
		}

		// Generate JWT token
		const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'fallback_secret', {
			expiresIn: '7d',
		})

		// Return user data and token
		res.status(200).json({
			message: 'Login successful',
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
			token,
			status: true,
		})
	} catch (error) {
		console.error('Login error:', error)
		res.status(500).json({ message: 'Server error', error, status: false })
	}
}

/**
 * Refreshes the user's access token using a refresh token.
 *
 * @param {Request} req - The HTTP request object containing the refresh token.
 * @param {Response} res - The HTTP response object used to send back the new access token.
 * @returns {Promise<void>} Resolves when the function completes, sending the response to the client.
 *
 * body parameters: refreshToken
 */
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
	const refreshToken = req.cookies.refreshToken

	if (!refreshToken) {
		res.status(401).json({ message: 'No refresh token found, please login again', status: false })
		return
	}

	try {
		// Verify the refresh token
		const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string)
		const userId = (decoded as { userId: string }).userId

		// Generate new access token (new 2-day expiry)
		const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
			expiresIn: '2d',
		})

		res.status(200).json({ newAccessToken })
	} catch (error) {
		res.status(401).json({ message: 'Invalid or expired refresh token, please login again', status: false })
	}
}

/**
 * Resets the user's password by sending a password reset email.
 *
 * @param {Request} req - The HTTP request object containing the user's email.
 * @param {Response} res - The HTTP response object used to send back the status of the password reset.
 * @returns {Promise<void>} Resolves when the function completes, sending the response to the client.
 *
 * body parameters: email
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email } = req.body
		if (!email) {
			res.status(400).json({ message: 'Email is required', status: false })
			return
		}
		const user = await Users.findByEmail(email)
		if (!user) {
			res.status(404).json({ message: 'User not found', status: false })
			return
		}
		// Generate a reset token (JWT)
		const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback_secret', {
			expiresIn: '15m',
		})
		const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?t=${resetToken}`

		// Send email with nodemailer

		const nodemailer = require('nodemailer')
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST || 'mailhog',
			port: parseInt(process.env.EMAIL_PORT || '1025', 10),
			auth: {
				user: process.env.EMAIL_USER || '',
				pass: process.env.EMAIL_PASS || '',
			},
		})
		const mailOptions = {
			from: 'no-reply@example.com',
			to: email,
			subject: 'Password Reset Request',
			html: `<p>You requested a password reset.</p><p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
		}
		await transporter.sendMail(mailOptions)

		// For testing: return the reset link in the response
		res.status(200).json({ message: 'Password reset link sent.', resetLink, status: true })
	} catch (error) {
		console.error('Reset password error:', error)
		res.status(500).json({ message: 'Server error', error, status: false })
	}
}
