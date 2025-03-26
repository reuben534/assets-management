const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    locationName: { type: String, required: true },
});

module.exports = mongoose.model('Location', locationSchema);