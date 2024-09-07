const {
	registerPatient,
	getHospitalRecord,
	getPatient,
	createAssessment,
} = require('./utils');
const mongoose = require('mongoose');
const { errorHandler, successHandler } = require('../utils/utils');
const { StatusCodes } = require('http-status-codes');
const Patient = require('../models/Patient');

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

const createAssessmentController = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { template_name, assessment_data, hospital_id } = req.body;

		if (!template_name || !assessment_data || !hospital_id) {
			return errorHandler(
				res,
				StatusCodes.BAD_REQUEST,
				'All fields are required.'
			);
		}

		const { assessment, hospitalRecordId } = await createAssessment(
			template_name,
			assessment_data,
			res,
			hospital_id,
			session
		);

		const patient = await Patient.findOne({
			hospital_record: hospitalRecordId,
		}).session(session);

		if (!patient) {
			await session.abortTransaction();
			session.endSession();
			return errorHandler(
				res,
				StatusCodes.NOT_FOUND,
				'Patient not found.'
			);
		}

		patient.assessments.push(assessment._id);
		await patient.save({ session });

		await session.commitTransaction();
		session.endSession();

		successHandler(
			res,
			StatusCodes.CREATED,
			assessment,
			'Assessment created successfully.'
		);
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error('Error creating assessment:', error.message);
		errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error.');
	}
};

module.exports = {
	registerPatientController,
	getHospitalRecordController,
	getPatientController,
	createAssessmentController,
};
