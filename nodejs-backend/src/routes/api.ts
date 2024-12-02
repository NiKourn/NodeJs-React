import express, { Request, Response } from 'express'; // Use import for express and types

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

// Register endpoint to create a user
router.get('/hello-world', helloWorld);

export default router;
