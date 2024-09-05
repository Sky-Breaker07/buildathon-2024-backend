const HospitalRecord = require('../../models/HospitalRecord');

const getHospitalRecord = async ({ hospital_id }) => {
	try {
		const hospitalRecord = await HospitalRecord.findOne({
			hospital_id: hospital_id,
		})
			.populate('biodata')
			.orFail()
			.exec();

		if (!hospitalRecord) {
			throw new Error('Hospital Record not found');
		}

		return hospitalRecord;
	} catch (error) {
		throw error;
	}
};

module.exports = getHospitalRecord;
