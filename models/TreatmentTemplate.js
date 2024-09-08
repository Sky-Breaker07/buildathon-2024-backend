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
  description: {
    type: String,
    trim: true,
  },
  fields: {
    type: Map,
    of: new mongoose.Schema({
      type: {
        type: String,
        enum: ['String', 'Number', 'Boolean', 'Array', 'Date', 'Object'],
        required: true,
      },
      required: {
        type: Boolean,
        default: false,
      },
      options: {
        type: [String],
        default: [],
      },
      label: {
        type: String,
        required: true,
      },
      placeholder: String,
      defaultValue: mongoose.Schema.Types.Mixed,
    }),
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

treatmentTemplateSchema.index({ name: 1, profession: 1 }, { unique: true });
treatmentTemplateSchema.index({ profession: 1 });
treatmentTemplateSchema.index({ name: 'text', description: 'text' });
treatmentTemplateSchema.index({ isActive: 1 });

const TreatmentTemplate = mongoose.model('TreatmentTemplate', treatmentTemplateSchema);

module.exports = TreatmentTemplate;
