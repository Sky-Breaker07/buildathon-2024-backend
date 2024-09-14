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

		placeholder: String,

		defaultValue: mongoose.Schema.Types.Mixed,
	},
	{ _id: false }
);

const evaluationTemplateSchema = new mongoose.Schema(
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
evaluationTemplateSchema.index({ name: 1, profession: 1 }, { unique: true });

// Text index for improved search capabilities
evaluationTemplateSchema.index({ name: 'text', description: 'text' });

// Additional indexes
evaluationTemplateSchema.index({ profession: 1 });
evaluationTemplateSchema.index({ isActive: 1 });

const EvaluationTemplate = mongoose.model(
	'EvaluationTemplate',
	evaluationTemplateSchema
);

module.exports = EvaluationTemplate;
