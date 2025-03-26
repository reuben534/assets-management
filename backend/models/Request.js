const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assetID: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    requestDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
});

module.exports = mongoose.model('Request', requestSchema);