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
			of: mongoose.Schema.Types.Mixed,
		},
	},
	{ timestamps: true }
);

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
