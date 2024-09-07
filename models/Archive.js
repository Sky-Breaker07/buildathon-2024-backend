const mongoose = require('mongoose');

const archiveSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['REMOVE', 'CHANGE_ADMIN_STATUS']
  },
  targetModel: {
    type: String,
    required: true,
    enum: ['HealthCareProfessional', 'HealthInformationManager']
  },
  targetId: {
    type: String,
    required: true
  },
  performedBy: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Archive = mongoose.model('Archive', archiveSchema);

module.exports = Archive;
