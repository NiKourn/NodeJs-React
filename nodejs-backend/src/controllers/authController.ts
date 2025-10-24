import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Users } from '@/models/user';
import jwt from 'jsonwebtoken';
import { encryptJWT, decryptJWT } from '@/utilities/functions';

const RESET_TOKEN_EXPIRY = '5m'; // Token expiry time
const LOGIN_TOKEN_EXPIRY = '7d'; // Login token expiry time
/**
 * Registers a new user by creating a new user document in the database.
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Generate username from email
    const username = email.split('@')[0];

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required', status: false });
      return;
    }

    // Check if user already exists
    const existingUser = await Users.findByEmail(email);

    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email', status: false });
      return;
    }

    // Check if username already exists
    const existingUsername = await Users.findByUsername(username);
    if (existingUsername) {
      res
        .status(400)
        .json({ message: 'Username already exists, please use another email', status: false });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await Users.create({
      email,
      username,
      password: hashedPassword,
    });

    // Generate JWT token to login the user immediately after registration
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'fallback_secret',
      {
        expiresIn: '7d',
      }
    );

    // Encrypt and send token in HttpOnly cookie
    const encryptedToken = encryptJWT(token);
    res.cookie('jwt', encryptedToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
    });

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
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error, status: false });
  }
};

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
    const { identifier, password } = req.body;

    // Validate required fields
    if (!identifier || !password) {
      res.status(400).json({ message: 'Username/email and password are required', status: false });
      return;
    }

    // Find user by email or username
    let user = await Users.findByEmail(identifier);
    if (!user) {
      user = await Users.findByUsername(identifier);
    }

    if (!user) {
      res.status(401).json({ message: 'Invalid username/email or password', status: false });
      return;
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid username/email or password', status: false });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      {
        expiresIn: LOGIN_TOKEN_EXPIRY,
      }
    );

    // Encrypt and send token in HttpOnly cookie
    const encryptedToken = encryptJWT(token);
    res.cookie('jwt', encryptedToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
    });

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
      token, // TODO: ENCRYPT TOKEN BEFORE SENDING TO CLIENT WHEN WE SET THE COOKIE CORRECTLY
      status: true,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error, status: false });
  }
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
    const userId = (decoded as { userId: string }).userId;

    // Generate new access token (new 2-day expiry)
    const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
      expiresIn: '2d',
    });

    res.status(200).json({ newAccessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired', status: false });
      return;
    }

    res
      .status(401)
      .json({ message: 'Invalid or expired refresh token, please login again', status: false });
  }
};

/**
 * Verifies the validity of a JWT token.
 *
 * @param {Request} req - The HTTP request object containing the token.
 * @param {Response} res - The HTTP response object used to send back the verification result.
 * @returns {Promise<void>} Resolves when the function completes, sending the response to the client.
 *
 * body parameters: token
 */
export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  const encryptedToken = req.cookies.jwt;
  if (!encryptedToken) {
    res.status(400).json({ message: 'No jwt cookie found', valid: false });
    return;
  }
  try {
    const token = decryptJWT(encryptedToken);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    res.status(200).json({
      message: 'Token is valid',
      valid: true,
      userId: (decoded as { userId: string }).userId,
    });
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired', valid: false });
  }
};

// /auth/me endpoint: returns user info if authenticated
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const encryptedToken = req.cookies.jwt;
  if (!encryptedToken) {
    res.status(401).json({ message: 'Not authenticated', status: false });
    return;
  }
  try {
    const token = decryptJWT(encryptedToken);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
      email: string;
    };
    const user = await Users.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found', status: false });
      return;
    }
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      status: true,
    });
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired', status: false });
  }
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
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required', status: false });
      return;
    }
    const user = await Users.findByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'User not found', status: false });
      return;
    }
    // Generate a reset token (JWT)
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: RESET_TOKEN_EXPIRY,
    });
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3100'}/reset-password?t=${resetToken}`;

    // Send email with nodemailer

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'mailhog',
      port: parseInt(process.env.EMAIL_PORT || '1025', 10),
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
      },
    });

    const tokenExpiry = RESET_TOKEN_EXPIRY.replace('m', '');
    const mailOptions = {
      from: 'no-reply@example.com',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. It's going to be valid for ${tokenExpiry} minutes.</p><p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };
    await transporter.sendMail(mailOptions);

    // For testing: return the reset link in the response
    res.status(200).json({ message: 'Password reset link sent.', resetLink, status: true });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error', error, status: false });
  }
};

/**
 *
 * @param {Request} req - The HTTP request object containing the user's email.
 * @param {Response} res - The HTTP response object used to send back the status of the password reset.
 * @returns {Promise<void>} Resolves when the function completes, sending the response to the client.
 *
 * body parameters: token, newPassword
 */
export const passwordReset = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400).json({ message: 'Token and new password are required', status: false });
    return;
  }

  try {
    // Verify the reset token. If invalid or expired, this should throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Get the userId from the decoded token
    const userId = Number((decoded as { userId: string }).userId);

    //encode new password and generate salt with 10 rounds
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await Users.updatePassword(userId, hashedPassword);

    res.status(200).json({ message: 'Password reset successful', status: true });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res
        .status(401)
        .json({ message: 'Token expired, please request for a new password again', status: false });
      return;
    }
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error', error, status: false });
  }
};

/**
 * Logs out the user by clearing the jwt cookie.
 */
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: 'Logged out successfully', status: true });
};
