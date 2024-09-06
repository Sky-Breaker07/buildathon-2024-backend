const { registerPatient, getHospitalRecord, getPatient } = require('./utils');
const { errorHandler, successHandler } = require('../utils/utils');
const { StatusCodes } = require('http-status-codes');

const registerPatientController = async (req, res) => {
	try {
		const { hospitalRecord } = await registerPatient(req.body);

		successHandler(
			res,
			StatusCodes.CREATED,
			hospitalRecord,
			'Patient registered successfully'
		);
	} catch (error) {
		console.error(error);
		errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error');
	}
};

const getHospitalRecordController = async (req, res) => {
	try {
		const { hospital_id } = req.body;

		if (!hospital_id) {
			return errorHandler(
				res,
				StatusCodes.BAD_REQUEST,
				'Hospital ID is required.'
			);
		}
		const hospitalRecord = await getHospitalRecord(hospital_id, res);

		successHandler(
			res,
			StatusCodes.OK,
			hospitalRecord,
			'Hospital Record fetched successfully'
		);
	} catch (error) {
		console.error(error);
		errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error');
	}
};

const getPatientController = async (req, res) => {
	try {
		const { hospital_id } = req.body;

		if (!hospital_id) {
			return errorHandler(
				res,
				StatusCodes.BAD_REQUEST,
				'Hospital ID is required.'
			);
		}

		const patient = await getPatient(hospital_id, res);

		successHandler(
			res,
			StatusCodes.OK,
			patient,
			'Patient fetched successfully.'
		);
	} catch (error) {
		console.error(error);
		errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error.');
	}
};

module.exports = {
	registerPatientController,
	getHospitalRecordController,
	getPatientController,
};
