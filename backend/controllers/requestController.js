const Request = require('../models/Request');
const Asset = require('../models/Asset');

exports.getRequests = async (req, res) => {
    try {
        let requests;
        if (req.user.role === 'Admin') {
            requests = await Request.find()
                .populate('userID', 'name email')
                .populate('assetID', 'name');
        } else {
            requests = await Request.find({ userID: req.user.id })
                .populate('assetID', 'name');
        }
        res.json(requests);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.addRequest = async (req, res) => {
    const { assetID } = req.body;
    try {
        const asset = await Asset.findById(assetID);
        if (!asset || asset.status !== 'Available') {
            return res.status(400).json({ msg: 'Asset not available' });
        }

        const request = new Request({
            userID: req.user.id,
            assetID,
        });
        await request.save();
        res.json(request);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateRequest = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const request = await Request.findById(id);
        if (!request) return res.status(404).json({ msg: 'Request not found' });

        request.status = status;
        await request.save();

        if (status === 'Approved') {
            await Asset.findByIdAndUpdate(request.assetID, { status: 'Assigned' });
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};