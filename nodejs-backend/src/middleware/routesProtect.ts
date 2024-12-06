import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/interface/auth';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
	const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header

	if (!token) {
		res.status(401).json({ message: 'No token provided, access denied' });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string };

		req.user = { id: decoded.id, email: decoded.email }; // Attach user info to the request
		next(); // Proceed to the next middleware
	} catch (err) {
		res.status(403).json({ message: 'Invalid or expired token' });
	}
};
