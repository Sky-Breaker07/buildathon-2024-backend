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

		isImage: {
			type: Boolean,
			default: false,
		},

		defaultValue: mongoose.Schema.Types.Mixed,
	},
	{ _id: false }
);

const treatmentTemplateSchema = new mongoose.Schema(
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
treatmentTemplateSchema.index({ name: 1, profession: 1 }, { unique: true });

// Text index for improved search capabilities
treatmentTemplateSchema.index({ name: 'text', description: 'text' });

// Additional indexes
treatmentTemplateSchema.index({ profession: 1 });
treatmentTemplateSchema.index({ isActive: 1 });

const TreatmentTemplate = mongoose.model(
	'TreatmentTemplate',
	treatmentTemplateSchema
);

module.exports = TreatmentTemplate;
