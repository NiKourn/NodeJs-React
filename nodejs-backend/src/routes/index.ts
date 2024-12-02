import { Router } from 'express';
import usersRoutes from './userRoutes';
import apiRoutes from './api';

const router = Router();

// Mount all routes
router.use('/', usersRoutes); // User routes
router.use('/', apiRoutes);

export default router;
