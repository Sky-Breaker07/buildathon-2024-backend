const Patient = require('../../models/Patient');
const HospitalRecord = require('../../models/HospitalRecord');

/**
 *
 * @param {string} hospital_id This is the unique id of the patient
 * @returns {object} This is the patient object
 * @throws {Error} If the patient is not found. Could be due to wrong hospital_id.
 * @description This function is used to get the full patient record whose hospital_id is passed.
 */

const getPatient = async (hospital_id) => {
	try {
		const hospitalRecord = await HospitalRecord.findOne({
			hospital_id: hospital_id,
		});

		if (!hospitalRecord) {
			throw new Error('Hospital Record not found.');
		}

		const patient = await Patient.findOne({
			hospital_record: hospitalRecord._id,
		})
			.populate('biodata')
			.populate({
				path: 'hospital_record',
				select: '-biodata',
			})
			.orFail()
			.exec();

		if (!patient) {
			throw new Error('Patient not Found.');
		}

		return patient;
	} catch (error) {
		throw error;
	}
};

module.exports = getPatient;
