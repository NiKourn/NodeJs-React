import { Server } from 'socket.io';
import * as http from 'http';

let io: Server | null = null;
const clients: Map<string, string> = new Map();

export const initializeWebSocket = (server: http.Server): void => {
	io = new Server(server, {
		cors: {
			origin: '*', // Adjust for your frontend's origin
			methods: ['GET', 'POST'],
		},
	});

	console.log('WebSocket server initialized');

	io.on('connection', (socket) => {
		console.log('A client connected:', socket.id);

		socket.on('register', (username: string) => {
			clients.set(socket.id, username);
			console.log(`User ${username} connected with socket id ${socket.id}`);
		});

		socket.on('message', (msg) => {
			console.log('Received message:', msg);
			socket.send('Message received');
		});

		socket.emit('welcome', { message: 'Hello! Welcome to the WebSocket server!' });

		socket.on('disconnect', () => {
			console.log('A client disconnected:', socket.id);
		});
	});
};

// Helper to get the WebSocket instance in other modules
export const getWebSocketServer = (): Server | null => {
	return io;
};

// Function to broadcast a message to all connected clients
export const sendMessageToClients = (message: string): void => {
	if (io) {
		io.emit('server-message', { message });
	}
};

// Function to send a message to a specific client by their socket id
export const sendMessageToClient = (socketId: string, message: string): void => {
	if (io) {
		io.to(socketId).emit('server-message', { message });
	}
};
