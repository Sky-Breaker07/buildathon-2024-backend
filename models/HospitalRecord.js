const mongoose = require('mongoose');

const hospitalRecordSchema = new mongoose.Schema({
	hospital_id: {
		type: String,
		trim: true,
		unique: true,
		default: null,
	},

	biodata: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BioData',
		default: null,
	},

	appointments: [
		{
			date: {
				type: Date,
				required: true,
			},
			status: {
				type: String,
				enum: ['Scheduled', 'Cancelled', 'Completed'],
				default: 'Scheduled',
			},
			time: {
				type: String,
				required: true,
				validate: (value) => {
					const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
					return timePattern.test(value);
				},
				message: 'Invalid time format. Please use HH:MM format.',
			},
		},
	],
});

hospitalRecordSchema.pre('save', async function (next) {
	if (!this.hospital_id) {
		const latestRecord = await this.constructor
			.findOne()
			.sort('-hospital_id');
		const lastId = latestRecord
			? parseInt(latestRecord.hospital_id.slice(3))
			: 0;
		this.hospital_id = `HOS${(lastId + 1).toString().padStart(6, '0')}`;
	}
	next();
});

const HospitalRecord = mongoose.model('HospitalRecord', hospitalRecordSchema);

module.exports = HospitalRecord;
