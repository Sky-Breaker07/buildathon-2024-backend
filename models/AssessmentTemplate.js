const mongoose = require('mongoose');

const assessmentTemplateSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},

		profession: {
			type: String,
			required: true,
		},

		fields: {
			type: Map,
			of: new mongoose.Schema(
				{
					type: {
						type: String,
						enum: [
							'String',
							'Number',
							'Boolean',
							'Array',
							'Date',
							'Object',
						],
						required: true,
					},

					required: {
						type: Boolean,
						default: false,
					},

					options: [String],
				},
				{ _id: false }
			),
		},
	},
	{ timestamps: true }
);

assessmentTemplateSchema.index({ name: 1, profession: 1 }, { unique: true });

const AssessmentTemplate = mongoose.model(
	'AssessmentTemplate',
	assessmentTemplateSchema
);

module.exports = AssessmentTemplate;
