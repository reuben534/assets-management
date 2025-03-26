const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getRequests, addRequest, updateRequest } = require('../controllers/requestController');

// Get all requests (Admin) or user-specific (Employee)
router.get('/', auth(), getRequests);
// Add request (Employee)
router.post('/', auth(['User']), addRequest);
// Update request status (Admin only)
router.put('/:id', auth(['Admin']), updateRequest);

module.exports = router;