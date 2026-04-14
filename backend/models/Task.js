const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  agent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Agent', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['visit', 'kyc', 'training', 'media', 'harvest', 'sync', 'other'],
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  farmerName: { 
    type: String, 
    default: 'System' 
  },
  farmName: { 
    type: String, 
    default: 'N/A' 
  },
  location: {
    type: String,
    default: ''
  },
  region: {
    type: String,
    required: false
  },
  farmer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Farmer' 
  },
  farm: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Farm' 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['urgent', 'normal', 'low'],
    default: 'normal'
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'done'],
    default: 'pending'
  },
  synced: { 
    type: Boolean, 
    default: true 
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
