import express, { Request, Response } from 'express'; // Use import for express and types
import {
  loginUser,
  passwordReset,
  registerUser,
  requestPasswordReset,
  verifyToken,
} from '../controllers/authController';

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

router.post('/register', registerUser); // POST /auth/register
router.post('/login', loginUser); // POST /auth/login
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', passwordReset); // POST /auth/reset-password
router.post('/verify-token', verifyToken);

// HTTP endpoint to send a message via WebSocket

// Register endpoint to create a user
router.get('/hello-world', helloWorld);

export default router;
