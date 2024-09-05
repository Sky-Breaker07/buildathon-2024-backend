const mongoose = require('mongoose');
const BioData = require('../models/Biodata');
const HospitalRecord = require('../models/HospitalRecord');
const Patient = require('../models/Patient');

const registerPatient = async (bioDataInfo) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const hospitalRecord = new HospitalRecord({
			appointments: [
				{
					date: Date.now(),
					time: '09:00',
					status: 'Scheduled',
				},
			],
		});
		await hospitalRecord.save({ session });

		const bioData = new BioData({
			...bioDataInfo,
			hospital_record: hospitalRecord._id,
		});
		await bioData.save({ session });

		hospitalRecord.biodata = bioData._id;
		await hospitalRecord.save({ session });

		const patient = new Patient({
			biodata: bioData._id,
			hospital_record: hospitalRecord._id,
		});

		await patient.save({ session });

		await session.commitTransaction();
		session.endSession();

		const patientData = await HospitalRecord.findById(hospitalRecord._id)
			.populate({
				path: 'biodata',
				select: '-hospital_record',
			})
			.orFail()
			.exec();

		return { hospitalRecord: patientData };
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}
};

module.exports = { registerPatient };
