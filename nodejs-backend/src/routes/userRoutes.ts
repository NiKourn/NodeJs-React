import express from 'express';
import { createUser, getAllUsers, deleteUser } from '../controllers/userController';

const router = express.Router();

// Define the routes
// POST /user - Create a new user
router.post('/user', createUser);

// GET /users - Get all users
router.get('/users', getAllUsers);

// DELETE /user/:id - Delete a user by ID
router.delete('/user/', deleteUser);

export default router;
