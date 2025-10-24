import express, { Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from '@/routes/index';
import http from 'http';
import { initializeWebSocket, sendMessageToClients } from '@/webSocket';
import { prisma } from '@/lib/prisma';
import cookieParser from 'cookie-parser';

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5500;

app.use(cookieParser());
// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3100', // get from .env or fallback
    credentials: true,
  })
); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests
initializeWebSocket(server);

// Use API routes
app.use('/api', routes);

const connectDB = async (): Promise<void> => {
  try {
    // Test the database connection
    await prisma.$connect();
    console.log('PostgreSQL connected successfully via Prisma');
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
    process.exit(1); // Exit the process if the connection fails
  }
};

connectDB();

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
