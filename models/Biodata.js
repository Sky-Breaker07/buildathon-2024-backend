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
			enum: ['Male', 'Female'],
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
			enum: ['Single', 'Married', 'Divorced', 'Widowed'],
			required: true,
		},

		address: {
			type: String,
			required: true,
			trim: true,
		},

		hospital_record: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'HospitalRecord',
			required: true,
		},
	},
	{ timestamps: true }
);

const BioData = mongoose.model('BioData', biodataSchema);

module.exports = BioData;
