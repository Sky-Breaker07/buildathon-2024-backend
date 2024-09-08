const { createAssessment } = require("./Assessment");
const HealthCareProfessional = require("../models/HealthCareProfessional");
const HospitalRecord = require("../models/HospitalRecord");

const { registerPatient, getHospitalRecord, getPatient } = require("./utils");
const mongoose = require("mongoose");
const { errorHandler, successHandler, paginateResults } = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");
const Patient = require("../models/Patient");

const { createTreatment } = require("./Treatment");

const registerPatientController = async (req, res) => {
  try {
    const { hospitalRecord } = await registerPatient(req.body);

    successHandler(
      res,
      StatusCodes.CREATED,
      hospitalRecord,
      "Patient registered successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getHospitalRecordController = async (req, res) => {
  try {
    const { hospital_id } = req.body;

    if (!hospital_id) {
      return errorHandler(
        res,
        StatusCodes.BAD_REQUEST,
        "Hospital ID is required."
      );
    }
    const hospitalRecord = await getHospitalRecord(hospital_id, res);

    successHandler(
      res,
      StatusCodes.OK,
      hospitalRecord,
      "Hospital Record fetched successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getPatientController = async (req, res) => {
  try {
    const { hospital_id } = req.body;

    if (!hospital_id) {
      return errorHandler(
        res,
        StatusCodes.BAD_REQUEST,
        "Hospital ID is required."
      );
    }

    const patient = await getPatient(hospital_id, res);

    successHandler(
      res,
      StatusCodes.OK,
      patient,
      "Patient fetched successfully."
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error.");
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
        "All fields are required."
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
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found.");
    }

    patient.assessments.push(assessment._id);
    await patient.save({ session });

    await session.commitTransaction();
    session.endSession();

    successHandler(
      res,
      StatusCodes.CREATED,
      assessment,
      "Assessment created successfully."
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating assessment:", error.message);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error.");
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
        "All fields are required."
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
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found.");
    }

    patient.treatments.push(treatment._id);
    await patient.save({ session });

    await session.commitTransaction();
    session.endSession();

    successHandler(
      res,
      StatusCodes.CREATED,
      treatment,
      "Treatment created successfully."
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating treatment:", error.message);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error.");
  }
};

const assignPatientToHealthcareProfessional = async (req, res) => {
  try {
    const { staffId, patientId } = req.body;
    const adminId = req.staff.staff_id;

    const admin = await HealthCareProfessional.findOne({ staff_id: adminId });
    if (!admin || !admin.isAdmin) {
      return errorHandler(
        res,
        StatusCodes.FORBIDDEN,
        "Only admins can assign patients"
      );
    }

    const hcp = await HealthCareProfessional.findOne({ staff_id: staffId });
    if (!hcp) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Healthcare professional not found"
      );
    }

    // Check if the admin and the healthcare professional are of the same profession
    if (admin.profession !== hcp.profession) {
      return errorHandler(
        res,
        StatusCodes.FORBIDDEN,
        "You can only assign patients to professionals in your own profession"
      );
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found");
    }

    if (!hcp.patientsAssigned.includes(patient.hospital_record)) {
      hcp.patientsAssigned.push(patient.hospital_record);
      await hcp.save();
    }

    successHandler(res, StatusCodes.OK, hcp, "Patient assigned successfully");
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to assign patient"
    );
  }
};

const updateSessionCount = async (req, res) => {
  try {
    const { hospital_id, sessionCount } = req.body;

    if (!hospital_id || sessionCount === undefined) {
      return errorHandler(
        res,
        StatusCodes.BAD_REQUEST,
        "Hospital ID and sessionCount are required."
      );
    }

    const hospitalRecord = await HospitalRecord.findOneAndUpdate(
      { hospital_id },
      { sessionCount },
      { new: true }
    );

    if (!hospitalRecord) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Hospital record not found."
      );
    }

    successHandler(
      res,
      StatusCodes.OK,
      hospitalRecord,
      "Session count updated successfully."
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error.");
  }
};

const updateNightCount = async (req, res) => {
  try {
    const { hospital_id, nightCount } = req.body;

    if (!hospital_id || nightCount === undefined) {
      return errorHandler(
        res,
        StatusCodes.BAD_REQUEST,
        "Hospital ID and nightCount are required."
      );
    }

    const hospitalRecord = await HospitalRecord.findOneAndUpdate(
      { hospital_id },
      { nightCount },
      { new: true }
    );

    if (!hospitalRecord) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Hospital record not found."
      );
    }

    successHandler(
      res,
      StatusCodes.OK,
      hospitalRecord,
      "Night count updated successfully."
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error.");
  }
};

const updateMortalityStatus = async (req, res) => {
  try {
    const { hospital_id, status, date, cause } = req.body;

    if (!hospital_id || status === undefined) {
      return errorHandler(
        res,
        StatusCodes.BAD_REQUEST,
        "Hospital ID and mortality status are required."
      );
    }

    const updateData = {
      "mortality.status": status,
      "mortality.date": date || null,
      "mortality.cause": cause || null,
    };

    const hospitalRecord = await HospitalRecord.findOneAndUpdate(
      { hospital_id },
      updateData,
      { new: true }
    );

    if (!hospitalRecord) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Hospital record not found."
      );
    }

    successHandler(
      res,
      StatusCodes.OK,
      hospitalRecord,
      "Mortality status updated successfully."
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error.");
  }
};

const createDischargeController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { template_name, discharge_data, hospital_id } = req.body;

    if (!template_name || !discharge_data || !hospital_id) {
      return errorHandler(
        res,
        StatusCodes.BAD_REQUEST,
        "All fields are required."
      );
    }

    const { discharge, hospitalRecordId } = await createDischarge(
      template_name,
      discharge_data,
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
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found.");
    }

    patient.discharges.push(discharge._id);
    await patient.save({ session });

    await session.commitTransaction();
    session.endSession();

    successHandler(
      res,
      StatusCodes.CREATED,
      discharge,
      "Discharge created successfully."
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error.");
  }
};

const createEvaluationController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { template_name, evaluation_data, hospital_id } = req.body;

    if (!template_name || !evaluation_data || !hospital_id) {
      return errorHandler(
        res,
        StatusCodes.BAD_REQUEST,
        "All fields are required."
      );
    }

    const { evaluation, hospitalRecordId } = await createEvaluation(
      template_name,
      evaluation_data,
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
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found.");
    }

    patient.evaluations.push(evaluation._id);
    await patient.save({ session });

    await session.commitTransaction();
    session.endSession();

    successHandler(
      res,
      StatusCodes.CREATED,
      evaluation,
      "Evaluation created successfully."
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error.");
  }
};

const getAllPatients = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { pageNumber, pageSize, skip } = paginateResults(page, limit);

    const totalPatients = await Patient.countDocuments();
    const patients = await Patient.find()
      .skip(skip)
      .limit(pageSize)
      .populate('biodata')
      .populate('hospital_record');

    const totalPages = Math.ceil(totalPatients / pageSize);

    successHandler(
      res,
      StatusCodes.OK,
      {
        patients,
        currentPage: pageNumber,
        totalPages,
        totalPatients,
      },
      "Patients retrieved successfully"
    );
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  registerPatientController,
  getHospitalRecordController,
  getPatientController,
  createAssessmentController,
  createTreatmentController,
  assignPatientToHealthcareProfessional,
  updateSessionCount,
  updateNightCount,
  updateMortalityStatus,
  createDischargeController,
  createEvaluationController,
  getAllPatients,
};
