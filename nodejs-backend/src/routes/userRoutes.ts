import express from 'express';
import { createUser, getAllUsers, deleteUser } from '../controllers/userController';
import { authenticate } from '../middleware/routesProtect';

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(authenticate);

// POST /user - Create a new user
router.post('/user', createUser);
// GET /users - Get all users
router.get('/users', getAllUsers);
// DELETE /user/:id - Delete a user by ID
router.delete('/user/', deleteUser);

export default router;
