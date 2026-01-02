const FieldVisit = require('../models/FieldVisit');
const Farmer = require('../models/Farmer');

// @route   GET api/field-visits
// @desc    Get all field visits for current agent
exports.getFieldVisits = async (req, res) => {
    try {
        const visits = await FieldVisit.find({ agent: req.agent.id })
            .populate('farmer', 'name contact region district community lyncId')
            .sort({ date: -1, time: -1 });
        res.json(visits);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/field-visits
// @desc    Log a new field visit
exports.logFieldVisit = async (req, res) => {
    const { farmerId, date, time, hoursSpent, purpose, notes, visitImages, challenges, status } = req.body;

    try {
        // Verify farmer exists and belongs to this agent
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ msg: 'Farmer not found' });
        }

        if (farmer.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const newVisit = new FieldVisit({
            agent: req.agent.id,
            farmer: farmerId,
            date,
            time,
            hoursSpent,
            purpose,
            notes,
            visitImages: visitImages || [],
            challenges: challenges || '',
            status: status || 'Completed'
        });

        const visit = await newVisit.save();

        // Update farmer's lastVisit date
        await Farmer.findByIdAndUpdate(farmerId, { lastVisit: date });

        const populatedVisit = await FieldVisit.findById(visit._id)
            .populate('farmer', 'name contact region district community');

        res.json(populatedVisit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   DELETE api/field-visits/:id
// @desc    Delete a field visit
exports.deleteFieldVisit = async (req, res) => {
    try {
        const visit = await FieldVisit.findById(req.params.id);
        if (!visit) return res.status(404).json({ msg: 'Visit not found' });

        // Make sure agent owns the visit
        if (visit.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await visit.deleteOne();
        res.json({ msg: 'Visit removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT api/field-visits/:id
// @desc    Update a field visit
exports.updateFieldVisit = async (req, res) => {
    const { date, time, hoursSpent, purpose, notes, visitImages, challenges, status } = req.body;

    try {
        let visit = await FieldVisit.findById(req.params.id);
        if (!visit) return res.status(404).json({ msg: 'Visit not found' });

        // Make sure agent owns the visit
        if (visit.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const visitFields = {
            date,
            time,
            hoursSpent,
            purpose,
            notes,
            visitImages: visitImages || visit.visitImages,
            challenges: challenges || visit.challenges,
            status: status || visit.status
        };

        visit = await FieldVisit.findByIdAndUpdate(
            req.params.id,
            { $set: visitFields },
            { new: true }
        ).populate('farmer', 'name contact region district community lyncId');

        // Update farmer's lastVisit date if it was changed
        if (date) {
            await Farmer.findByIdAndUpdate(visit.farmer._id, { lastVisit: date });
        }

        res.json(visit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
