const Asset = require('../models/Asset');

exports.getAssets = async (req, res) => {
    try {
        const assets = await Asset.find()
            .populate('locationID', 'locationName')
            .populate('categoryID', 'categoryName')
            .populate('supplierID', 'supplierName');
        res.json(assets);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.addAsset = async (req, res) => {
    const { name, description, purchaseDate, warrantyDate, locationID, categoryID, supplierID, status } = req.body;
    try {
        const asset = new Asset({
            name,
            description,
            purchaseDate,
            warrantyDate,
            locationID,
            categoryID,
            supplierID,
            status,
        });
        await asset.save();
        res.json(asset);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateAsset = async (req, res) => {
    const { id } = req.params;
    try {
        const asset = await Asset.findByIdAndUpdate(id, req.body, { new: true });
        if (!asset) return res.status(404).json({ msg: 'Asset not found' });
        res.json(asset);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deleteAsset = async (req, res) => {
    const { id } = req.params;
    try {
        const asset = await Asset.findByIdAndDelete(id);
        if (!asset) return res.status(404).json({ msg: 'Asset not found' });
        res.json({ msg: 'Asset deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};