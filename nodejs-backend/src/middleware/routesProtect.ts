import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import { AuthRequest } from './interface/types';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
	const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header

	if (!token) {
		res.status(401).json({ message: 'No token provided, access denied' });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string };
		console.log('decoded', decoded);

		req.user = { id: decoded.id, email: decoded.email }; // Attach user info to the request
		next(); // Proceed to the next middleware
	} catch (err) {
		res.status(403).json({ message: 'Invalid or expired token' });
	}
};

// export const requiredParams = (req: Request, res: Response, next: NextFunction) => {
// 	let apiVersion;

// 	// Check for 'api-version' in the query parameters for GET requests
// 	if (req.method === 'GET') {
// 		apiVersion = req.query['api-version'];
// 	}
// 	// Check for 'api-version' in the body for POST requests
// 	else if (req.method === 'POST') {
// 		apiVersion = req.body['api-version'];
// 	}

// 	// If 'api-version' is not present, return an error
// 	if (!apiVersion) {
// 		res.status(400).json({
// 			message: 'API version is required',
// 			status: false,
// 		});
// 		return;
// 	}

// 	// Optionally, validate the version if needed
// 	// if (apiVersion !== '1.0.0') {
// 	//   return res.status(400).json({ message: 'Invalid API version' });
// 	// }

// 	next(); // Proceed to the next middleware or route handler
// };
