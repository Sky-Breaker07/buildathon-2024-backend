const { registerPatient, getHospitalRecord } = require('./utils');
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
		const hospitalRecord = await getHospitalRecord(req.body);

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

module.exports = { registerPatientController, getHospitalRecordController };
