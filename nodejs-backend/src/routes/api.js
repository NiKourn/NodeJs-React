const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define an endpoint to get user data
router.get('/users', userController.getAllUsers);

// Define an endpoint to create a user
router.post('/users', userController.createUser);

module.exports = router;
