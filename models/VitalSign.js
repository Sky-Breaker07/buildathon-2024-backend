const mongoose = require('mongoose');

const vitalSignSchema = new mongoose.Schema(
	{
		blood_pressure: {
			systemicBP: {
				type: Number,
				default: null,
			},

			diastolicBP: {
				type: Number,
				default: null,
			},
		},

		pulse_rate: {
			type: Number,
			default: null,
		},

		respiratory_rate: {
			type: Number,
			default: null,
		},

		temperature: {
			type: Number,
			default: null,
		},

		spo2: {
			type: Number,
			default: null,
		},
	},
	{ timestamps: true }
);

const VitalSign = mongoose.model('VitalSign', vitalSignSchema);

module.exports = VitalSign;
