const HospitalRecord = require('../../models/HospitalRecord');

/**
 *
 * @param {string} hospital_id This is the unique id of the patient
 * @returns {object} This is the hospital record of the patient.
 * @throws {Error} If the hospital record is not found. Could be due to wrong hospital_id.
 * @description This function is used to get the hospital record of the patient whose hospital_id is passed.
 */

const getHospitalRecord = async (hospital_id) => {
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
