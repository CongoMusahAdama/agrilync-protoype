const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const blogAdminSchema = new mongoose.Schema({
    username: { type: String, required: true, default: 'BlogAdmin' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    requiresPasswordChange: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

blogAdminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

blogAdminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.BlogAdmin || mongoose.model('BlogAdmin', blogAdminSchema);
