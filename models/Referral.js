const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema(
	{
		template: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ReferralTemplate',
			required: true,
		},

		hospital_record: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'HospitalRecord',
			required: true,
		},

		referral_data: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
	},
	{ timestamps: true }
);

// Add indexes
referralSchema.index({ template: 1 });
referralSchema.index({ hospital_record: 1 });
referralSchema.index({ createdAt: -1 });

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
