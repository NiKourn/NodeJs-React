import express, { Router } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes/index';
import http from 'http';
import { initializeWebSocket, sendMessageToClients } from './webSocket';

dotenv.config(); // Load environment variables (e.g., for MongoDB URI)

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests
initializeWebSocket(server);

// Connect to MongoDB (assuming you use MongoDB for this example)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:root@mongodb-srv:27017/db_app?authSource=admin'; // Default fallback URI

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
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
