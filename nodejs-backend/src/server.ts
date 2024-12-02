import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes/index';

dotenv.config(); // Load environment variables (e.g., for MongoDB URI)

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB (assuming you use MongoDB for this example)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:root@mongodb-srv:27017/db_app?authSource=admin'; // Default fallback URI

app.get('/', (req: any, res: any) => {
	res.send('Hello, my friendsZZssss!!');
});

// Use API routes
app.use('/api', routes);
const connectDB = async (): Promise<void> => {
	try {
		// Replace `process.env.MONGODB_URI` with your actual MongoDB URI if not using .env
		await mongoose.connect(MONGODB_URI);

		console.log('MongoDB connected successfully');
	} catch (err) {
		console.error('Error connecting to MongoDB:', err);
		process.exit(1); // Exit the process if the connection fails
	}
};

connectDB();

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
