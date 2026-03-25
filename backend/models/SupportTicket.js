const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
    ticketId: { type: String, required: true, unique: true }, // e.g., TKT-1234
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    userType: { 
        type: String, 
        enum: ['agent', 'grower', 'investor', 'super_admin'], 
        default: 'agent' 
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Technical', 'App Bug', 'Farmer Onboarding', 'Payouts', 'Other'],
        default: 'Other'
    },
    status: { 
        type: String, 
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    messages: [{
        sender: { type: String, required: true }, // 'user' or 'support'
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    attachments: [String], // Cloudinary URLs
    region: { type: String },
    district: { type: String },
    community: { type: String }
}, { timestamps: true });

// Indexes for performance
supportTicketSchema.index({ user: 1, createdAt: -1 });
supportTicketSchema.index({ status: 1 });

module.exports = mongoose.models.SupportTicket || mongoose.model('SupportTicket', supportTicketSchema);
