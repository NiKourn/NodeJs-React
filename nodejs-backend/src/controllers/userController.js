const User = require('../models/User'); // Assuming you have a model for users

// Get all users
exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find(); // Find all users from the database
		res.status(200).json(users); // Respond with the user data
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch users' });
	}
};

// Create a new user
exports.createUser = async (req, res) => {
	const { name, email } = req.body;
	try {
		const newUser = new User({ name, email });
		await newUser.save();
		res.status(201).json(newUser); // Respond with the newly created user
	} catch (error) {
		res.status(400).json({ error: 'Failed to create user' });
	}
};
