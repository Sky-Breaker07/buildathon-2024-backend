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
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
	},
	{ timestamps: true }
);

// Add indexes
treatmentSchema.index({ template: 1 });
treatmentSchema.index({ hospital_record: 1 });
treatmentSchema.index({ createdAt: -1 });

const Treatment = mongoose.model('Treatment', treatmentSchema);

module.exports = Treatment;
