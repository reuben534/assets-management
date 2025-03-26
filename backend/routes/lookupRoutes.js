const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getLocations, getCategories, getSuppliers } = require('../controllers/lookupController');

// Get all locations (Admin only)
router.get('/locations', auth(['Admin']), getLocations);
// Get all categories (Admin only)
router.get('/categories', auth(['Admin']), getCategories);
// Get all suppliers (Admin only)
router.get('/suppliers', auth(['Admin']), getSuppliers);

module.exports = router;