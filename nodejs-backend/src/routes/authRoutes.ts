import express, { Request, Response } from 'express'; // Use import for express and types
import {
  loginUser,
  passwordReset,
  registerUser,
  requestPasswordReset,
  verifyToken,
  getCurrentUser,
  logoutUser,
} from '@/controllers/authController';
import { loginLimiter, createLoginLimiter } from '@/middleware/routesProtect';

const router = express.Router();

const helloWorld = async (req: Request, res: Response) => {
  try {
    console.log(req.query);
    res.status(201).json({ message: 'Hello World' });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error });
  }
};

// You can use loginLimiter (default: 10 mins, 3 requests) or createLoginLimiter(custom)
router.post('/register', loginLimiter, registerUser); // Default
router.post('/login', loginLimiter, loginUser); // Default
router.post('/request-password-reset', createLoginLimiter(15, 2), requestPasswordReset); // Custom example
router.post('/reset-password', loginLimiter, passwordReset); // Default
router.post('/verify-token', loginLimiter, verifyToken);

// Authenticated user info
router.get('/me', getCurrentUser);

// Logout route
router.post('/logout', logoutUser);

// HTTP endpoint to send a message via WebSocket
router.get('/hello-world', helloWorld);

export default router;
