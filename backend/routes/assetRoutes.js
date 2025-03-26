const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAssets, addAsset, updateAsset, deleteAsset } = require('../controllers/assetController');

// Get all assets (Admin or Employee can view)
router.get('/', auth(), getAssets);
// Add asset (Admin only)
router.post('/', auth(['Admin']), addAsset);
// Update asset (Admin only)
router.put('/:id', auth(['Admin']), updateAsset);
// Delete asset (Admin only)
router.delete('/:id', auth(['Admin']), deleteAsset);

module.exports = router;