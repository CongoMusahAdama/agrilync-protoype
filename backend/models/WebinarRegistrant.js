const mongoose = require('mongoose');

const webinarRegistrantSchema = new mongoose.Schema(
    {
        webinarId: { type: Number, required: true, index: true },
        webinarTitle: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, trim: true, default: '' },
        organization: { type: String, trim: true, default: '' },
    },
    { timestamps: true }
);

webinarRegistrantSchema.index({ email: 1, webinarId: 1 }, { unique: true });

module.exports =
    mongoose.models.WebinarRegistrant ||
    mongoose.model('WebinarRegistrant', webinarRegistrantSchema);
