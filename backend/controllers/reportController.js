const Report = require('../models/Report');
const Asset = require('../models/Asset');
const Request = require('../models/Request');

exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('generatedBy', 'name');
        res.json(reports);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.generateReport = async (req, res) => {
    const { reportType } = req.body;

    try {
        let content;

        if (reportType === 'asset-usage') {
            const assets = await Asset.find();
            content = JSON.stringify({
                totalAssets: assets.length,
                available: assets.filter(a => a.status === 'Available').length,
                assigned: assets.filter(a => a.status === 'Assigned').length,
                underMaintenance: assets.filter(a => a.status === 'Under Maintenance').length,
            });
        } else if (reportType === 'request-history') {
            const requests = await Request.find()
                .populate('userID', 'name')
                .populate('assetID', 'name');
            content = JSON.stringify(
                requests.map(req => ({
                    user: req.userID?.name || 'Unknown',
                    asset: req.assetID?.name || 'Unknown',
                    status: req.status,
                    requestDate: req.requestDate,
                }))
            );
        } else {
            return res.status(400).json({ msg: 'Invalid report type. Use "asset-usage" or "request-history"' });
        }

        const report = new Report({
            generatedBy: req.user.id,
            content,
            generatedDate: new Date(),
        });
        await report.save();

        // Populate generatedBy for the response
        const populatedReport = await Report.findById(report._id).populate('generatedBy', 'name');
        res.json(populatedReport);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};