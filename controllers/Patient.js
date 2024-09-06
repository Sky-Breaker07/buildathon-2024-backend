const { registerPatient, getHospitalRecord, getPatient } = require('./utils');
const { errorHandler, successHandler } = require('../utils/utils');

const registerPatientController = async (req, res) => {
	try {
		const { hospitalRecord } = await registerPatient(req.body);

		successHandler(
			res,
			201,
			hospitalRecord,
			'Patient registered successfully'
		);
	} catch (error) {
		console.error(error);
		errorHandler(res, 500, 'Server Error');
	}
};

const getHospitalRecordController = async (req, res) => {
	try {
		const { hospital_id } = req.body;

		if (!hospital_id) {
			return errorHandler(res, 400, 'Hospital ID is required.');
		}
		const hospitalRecord = await getHospitalRecord(hospital_id, res);

		successHandler(
			res,
			200,
			hospitalRecord,
			'Hospital Record fetched successfully'
		);
	} catch (error) {
		console.error(error);
		errorHandler(res, 500, 'Server Error');
	}
};

const getPatientController = async (req, res) => {
	try {
		const { hospital_id } = req.body;

		if (!hospital_id) {
			return errorHandler(res, 400, 'Hospital ID is required.');
		}

		const patient = await getPatient(hospital_id, res);

		successHandler(res, 200, patient, 'Patient fetched successfully.');
	} catch (error) {
		console.error(error);
		errorHandler(res, 500, 'Server Error.');
	}
};

module.exports = {
	registerPatientController,
	getHospitalRecordController,
	getPatientController,
};
