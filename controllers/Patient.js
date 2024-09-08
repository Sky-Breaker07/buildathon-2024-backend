const {
	createAssessment
} = require('./Assessment');
const HealthCareProfessional = require('../models/HealthCareProfessional');

const {registerPatient, getHospitalRecord, getPatient} = require('./utils');
const mongoose = require('mongoose');
const { errorHandler, successHandler } = require('../utils/utils');
const { StatusCodes } = require('http-status-codes');
const Patient = require('../models/Patient');

const { createTreatment } = require('./Treatment');

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

const createTreatmentController = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { template_name, treatment_data, hospital_id } = req.body;

		if (!template_name || !treatment_data || !hospital_id) {
			return errorHandler(
				res,
				StatusCodes.BAD_REQUEST,
				'All fields are required.'
			);
		}

		const { treatment, hospitalRecordId } = await createTreatment(
			template_name,
			treatment_data,
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

		patient.treatments.push(treatment._id);
		await patient.save({ session });

		await session.commitTransaction();
		session.endSession();

		successHandler(
			res,
			StatusCodes.CREATED,
			treatment,
			'Treatment created successfully.'
		);
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error('Error creating treatment:', error.message);
		errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error.');
	}
};

const assignPatientToHealthcareProfessional = async (req, res) => {
	try {
	  const { staffId, patientId } = req.body;
	  const adminId = req.staff.staff_id;
	
	  const admin = await HealthCareProfessional.findOne({ staff_id: adminId });
	  if (!admin || !admin.isAdmin) {
		return errorHandler(res, StatusCodes.FORBIDDEN, 'Only admins can assign patients');
	  }
	
	  const hcp = await HealthCareProfessional.findOne({ staff_id: staffId });
	  if (!hcp) {
		return errorHandler(res, StatusCodes.NOT_FOUND, 'Healthcare professional not found');
	  }
	
	  // Check if the admin and the healthcare professional are of the same profession
	  if (admin.profession !== hcp.profession) {
		return errorHandler(res, StatusCodes.FORBIDDEN, 'You can only assign patients to professionals in your own profession');
	  }
	
	  const patient = await Patient.findById(patientId);
	  if (!patient) {
		return errorHandler(res, StatusCodes.NOT_FOUND, 'Patient not found');
	  }
	
	  if (!hcp.patientsAssigned.includes(patient.hospital_record)) {
		hcp.patientsAssigned.push(patient.hospital_record);
		await hcp.save();
	  }
	
	  successHandler(
		res,
		StatusCodes.OK,
		hcp,
		'Patient assigned successfully'
	  );
	} catch (error) {
	  console.error(error);
	  errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to assign patient');
	}
  };

module.exports = {
	registerPatientController,
	getHospitalRecordController,
	getPatientController,
	createAssessmentController,
	createTreatmentController,
	assignPatientToHealthcareProfessional
};
