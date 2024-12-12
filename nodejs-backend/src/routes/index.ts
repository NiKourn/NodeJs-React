import { Router } from 'express';
import usersRoutes from './userRoutes';
import authRoutes from './authRoutes';
import productsRoutes from './productsRoutes';
import broadcastRoutes from './broadcastRoutes';
import { sendMessageToClients } from '../webSocket';

const router = Router();

// Public routes
router.use('/auth', authRoutes);
router.use('/broadcast', broadcastRoutes);

//Private routes NOTE: place all private routes under this
router.use('/', [usersRoutes, productsRoutes]); // User routes

export default router;
