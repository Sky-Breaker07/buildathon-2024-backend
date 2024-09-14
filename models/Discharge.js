const mongoose = require('mongoose');

const dischargeSchema = new mongoose.Schema(
	{
		template: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'DischargeTemplate',
			required: true,
		},

		hospital_record: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'HospitalRecord',
			required: true,
		},

		discharge_data: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
	},
	{ timestamps: true }
);

// Add indexes
dischargeSchema.index({ template: 1 });
dischargeSchema.index({ hospital_record: 1 });
dischargeSchema.index({ createdAt: -1 });

const Discharge = mongoose.model('Discharge', dischargeSchema);

module.exports = Discharge;
