import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Users } from '../models/user';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { getApiBaseUrl, getEnvironment } from '../utilities/functions';

/**
 * Registers a new user by creating a new user document in the database.
 *
 * @param {import('express').Request} req - The HTTP request object containing the user's email, password, and details.
 * @param {import('express').Response} res - The HTTP response object used to send back the status of the registration.
 * @returns {Promise<void>} Resolves when the function completes, sending the response to the client.
 *
 * body parameters: email, password, details
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password, details } = req.body;
		const username = email.split('@')[0]; // Extract username from the email

		// Check if email or username already exists
		const existingEmailUser = await Users.findOne({ email });
		const existingUsernameUser = await Users.findOne({ username });

		if (existingEmailUser) {
			res.status(400).json({ message: 'User already exists with this email', status: false });
			return;
		}

		if (existingUsernameUser) {
			res.status(400).json({ message: 'Username already exists', status: false });
			return;
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create a new user
		const newUser = new Users({ email, username, password: hashedPassword, details });
		await newUser.save();

		res.status(201).json({ message: 'User registered successfully', status: true });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error, status: false });
	}
};

/**
 * Logs in a user by verifying their credentials and returns a JWT token.
 *
 * @param {Request} req - The HTTP request object containing the user's email and password.
 * @param {Response} res - The HTTP response object used to send back the token and user information.
 * @returns {Promise<void>} Resolves when the function completes, sending the response to the client.
 *
 * body parameters: email, password
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
	const { emailOrUsername, password } = req.body;

	// Find user by email or username
	const user = await Users.findOne({
		$or: [{ email: emailOrUsername }, { username: emailOrUsername }],
	});

	if (!user) {
		res.status(404).json({ message: 'User not found', status: false });
		return;
	}

	// Verify the password
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		res.status(401).json({ message: 'Invalid credentials', status: false });
		return;
	}

	// Generate a JWT token (access and refresh token)
	const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
		expiresIn: '2d', // 2 days expiration
	});

	const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
		expiresIn: '30d', // 30 days expiration
	});

	// Save the refresh token in httpOnly cookie or secure storage
	res.cookie('refreshToken', refreshToken, {
		httpOnly: false,
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
	});

	res.status(200).json({ message: 'Login successful', accessToken, refreshToken, status: true, user });
};

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
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		res.status(401).json({ message: 'No refresh token found, please login again', status: false });
		return;
	}

	try {
		// Verify the refresh token
		const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string);
		const userId = (decoded as { id: string }).id;

		// Generate new access token (new 2-day expiry)
		const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
			expiresIn: '2d',
		});

		res.status(200).json({ newAccessToken });
	} catch (error) {
		res.status(401).json({ message: 'Invalid or expired refresh token, please login again' });
	}
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
	// Remove the refresh token from cookies (logout)
	res.clearCookie('refreshToken');
	res.status(200).json({ message: 'Logged out successfully' });
};

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
	const { email } = await req.body;

	const user = await Users.findOne({ email });
	if (!user) {
		res.status(404).json({ message: 'User not found', status: false });
		return;
	}

	// Generate a JWT token
	const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
		expiresIn: '15m', // Sign a token that expires in 15 minutes
	});
	//create a reset link
	const resetLink = `${getApiBaseUrl(req.headers.host as string)}reset-password?t=${resetToken}`;
	/**
	 * Sends a password reset email to the user.
	 *
	 * @returns {Promise<void>} Resolves when the email is sent.
	 */
	const sendResetPasswordEmail = async (): Promise<void> => {
		const mailOptions = {
			from: 'no-reply@example.com',
			to: email,
			subject: 'Password Reset Request',
			html: `
		<p>You requested a password reset.</p>
		<p>Click <a href="${resetLink}">here</a> to reset your password.</p>
	`,
		};

		// Create a nodemailer transporter
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST || 'mailhog',
			port: parseInt(process.env.EMAIL_PORT || '1025', 10),
			auth: {
				user: process.env.EMAIL_USER || '',
				pass: process.env.EMAIL_PASS || '',
			},
		});

		await transporter.sendMail(mailOptions);
	};

	try {
		const { isLocal } = getEnvironment(req.headers.host as string);
		if (isLocal) {
			await sendResetPasswordEmail();
		}
		res.status(200).json({ message: 'Password reset email sent.' });
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({ message: 'Failed to send email.' });
	}
};
