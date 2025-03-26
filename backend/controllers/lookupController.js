const Location = require('../models/Location');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');

exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};