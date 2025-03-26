const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUsers, addUser, updateUser, deleteUser } = require('../controllers/userController');

// Get all users (Admin only)
router.get('/', auth(['Admin']), getUsers);
// Add user (Admin only)
router.post('/', auth(['Admin']), addUser);
// Update user (Admin only)
router.put('/:id', auth(['Admin']), updateUser);
// Delete user (Admin only)
router.delete('/:id', auth(['Admin']), deleteUser);

module.exports = router;