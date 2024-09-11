const mongoose = require('mongoose');

const biodataSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		age: {
			type: Number,
			required: true,
			min: 0,
		},

		sex: {
			type: String,
			enum: ['male', 'female'],
			required: true,
		},

		tribe: {
			type: String,
			required: true,
			trim: true,
		},

		religion: {
			type: String,
			required: true,
			trim: true,
		},

		occupation: {
			type: String,
			required: true,
			trim: true,
		},

		marital_status: {
			type: String,
			enum: ['single', 'married', 'divorced', 'widowed'],
			required: true,
		},

		address: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

const BioData = mongoose.model('BioData', biodataSchema);

module.exports = BioData;
