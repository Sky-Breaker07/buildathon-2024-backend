const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
	{
		template: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'AssessmentTemplate',
			required: true,
		},

		hospital_record: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'HospitalRecord',
			required: true,
		},

		assessment_data: {
			type: Map,
			of: new mongoose.Schema({
				type: Map,
				of: mongoose.Schema.Types.Mixed,
			}, { _id: false }),
		},
	},
	{ timestamps: true }
);

// Add indexes
assessmentSchema.index({ template: 1 });
assessmentSchema.index({ hospital_record: 1 });
assessmentSchema.index({ createdAt: -1 });

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
