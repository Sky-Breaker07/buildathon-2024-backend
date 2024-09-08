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

	treatments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Treatment',
		},
	],

	discharges: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Discharge',
		},
	],

	evaluations: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Evaluation',
		},
	],
});

// Add indexes
patientSchema.index({ hospital_record: 1 });
patientSchema.index({ biodata: 1 });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
