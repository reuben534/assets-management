const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    generatedDate: { type: Date, default: Date.now },
    content: { type: String, required: true }, // Could be JSON stringified data
});

module.exports = mongoose.model('Report', reportSchema);