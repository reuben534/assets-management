const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getReports, generateReport } = require('../controllers/reportController');

// Get all reports (Admin only)
router.get('/', auth(['Admin']), getReports);
// Generate new report (Admin only)
router.post('/', auth(['Admin']), generateReport);

module.exports = router;