const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    supplierName: { type: String, required: true },
    contactPerson: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
});

module.exports = mongoose.model('Supplier', supplierSchema);