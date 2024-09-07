const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema(
  {
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TreatmentTemplate',
      required: true,
    },

    hospital_record: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HospitalRecord',
      required: true,
    },

    treatment_data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Treatment = mongoose.model('Treatment', treatmentSchema);

module.exports = Treatment;
