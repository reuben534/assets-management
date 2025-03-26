const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    purchaseDate: { type: Date, required: true },
    warrantyDate: { type: Date },
    locationID: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    supplierID: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    status: { type: String, enum: ['Available', 'Assigned', 'Under Maintenance'], default: 'Available' },
    addedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Asset', assetSchema);