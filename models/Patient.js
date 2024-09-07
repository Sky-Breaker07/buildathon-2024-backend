const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
	biodata: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BioData',
		required: true,
	},

	hospital_record: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'HospitalRecord',
		required: true,
	},

	vital_signs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'VitalSign',
			default: null,
		},
	],

	assessments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Assessment',
			default: null,
		},
	],
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
