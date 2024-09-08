const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthCareProfessional',
    required: true
  },
  receivers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthCareProfessional',
    required: true
  }],
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  attachments: [{
    type: String,
    // Store file paths or URLs
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Communication = mongoose.model('Communication', communicationSchema);

module.exports = Communication;
