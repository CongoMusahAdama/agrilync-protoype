const { Training, AgentTraining } = require('../models/Training');

// @route   GET api/trainings
// @desc    Get all available trainings
exports.getAvailableTrainings = async (req, res) => {
    try {
        const trainings = await Training.find();
        res.json(trainings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/trainings/my
// @desc    Get current agent's trainings
exports.getMyTrainings = async (req, res) => {
    try {
        const trainings = await AgentTraining.find({ agent: req.agent.id }).populate('training');
        res.json(trainings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/trainings/register/:id
// @desc    Register for a training
exports.registerTraining = async (req, res) => {
    try {
        const training = await Training.findById(req.params.id);
        if (!training) return res.status(404).json({ msg: 'Training not found' });

        // Check if already registered
        let registration = await AgentTraining.findOne({ agent: req.agent.id, training: req.params.id });
        if (registration) return res.status(400).json({ msg: 'Already registered for this training' });

        const newRegistration = new AgentTraining({
            agent: req.agent.id,
            training: req.params.id,
            status: 'Registered'
        });

        await newRegistration.save();
        res.json(newRegistration);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT api/trainings/status/:id
// @desc    Update training status (Internal/Admin could use this, or agent for self-reporting)
exports.updateTrainingStatus = async (req, res) => {
    const { status, certificate } = req.body;

    try {
        let registration = await AgentTraining.findById(req.params.id);
        if (!registration) return res.status(404).json({ msg: 'Registration not found' });

        if (registration.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (status) registration.status = status;
        if (certificate !== undefined) registration.certificate = certificate;

        await registration.save();
        res.json(registration);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
