const mongoose = require('mongoose');

const treatmentTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profession: {
    type: String,
    required: true,
    trim: true,
  },
  fields: {
    type: Map,
    of: new mongoose.Schema({
      type: {
        type: String,
        required: true,
        enum: ['text', 'number', 'boolean', 'select'],
      },
      required: {
        type: Boolean,
        default: false,
      },
      options: {
        type: [String],
        default: [],
      },
    }),
    required: true,
  },
}, { timestamps: true });

treatmentTemplateSchema.index({ name: 1, profession: 1 }, { unique: true });


const TreatmentTemplate = mongoose.model('TreatmentTemplate', treatmentTemplateSchema);

module.exports = TreatmentTemplate;
