const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema(
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

		label: {
			type: String,
			required: true,
		},

		isImage: {
			type: Boolean,
			default: false,
		},

		placeholder: String,

		defaultValue: mongoose.Schema.Types.Mixed,
	},
	{ _id: false }
);

const assessmentTemplateSchema = new mongoose.Schema(
	{
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
			of: {
				type: Map,
				of: fieldSchema,
			},
		},

		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

// Compound index for name and profession
assessmentTemplateSchema.index({ name: 1, profession: 1 }, { unique: true });

// Text index for improved search capabilities
assessmentTemplateSchema.index({ name: 'text', description: 'text' });

// Additional indexes
assessmentTemplateSchema.index({ profession: 1 });
assessmentTemplateSchema.index({ isActive: 1 });

const AssessmentTemplate = mongoose.model(
	'AssessmentTemplate',
	assessmentTemplateSchema
);

module.exports = AssessmentTemplate;
