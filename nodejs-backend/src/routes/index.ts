import { Router, Request, Response, NextFunction } from 'express';
import usersRoutes from './userRoutes';
import authRoutes from './authRoutes';
import productsRoutes from './productsRoutes';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

//Private routes NOTE: place all private routes under this
router.use('/', [usersRoutes, productsRoutes]); // User routes

export default router;
