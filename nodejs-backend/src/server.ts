/**
 *
 * THIS IS JUST A SIMPLE SERVER TO TEST IF THE SERVER IS RUNNING
 */

const express = require('express');
const app = express();

app.get('/', (req: any, res: any) => {
	res.send('Hello, my friendsZZss');
});

const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

// src/server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const apiRoutes = require('./routes/api'); // Import the routes you created

// dotenv.config(); // Load environment variables (e.g., for MongoDB URI)

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors()); // Allow cross-origin requests
// app.use(express.json()); // Parse incoming JSON requests

// // Connect to MongoDB (assuming you use MongoDB for this example)
// mongoose
// 	.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 	.then(() => console.log('Connected to MongoDB'))
// 	.catch((err) => console.log('Failed to connect to MongoDB', err));

// // Use API routes
// app.use('/api', apiRoutes); // Mount the API routes under the `/api` path

// // Start the server
// app.listen(PORT, () => {
// 	console.log(`Server is running on http://localhost:${PORT}`);
// });
