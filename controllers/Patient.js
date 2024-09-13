const HealthCareProfessional = require("../models/HealthCareProfessional");
const HospitalRecord = require("../models/HospitalRecord");
const BioData = require("../models/Biodata");
const HealthInformationManager = require("../models/HealthInformationManager");
const Patient = require("../models/Patient");
const Discharge = require("../models/Discharge");
const Evaluation = require("../models/Evaluation");
const Assessment = require("../models/Assessment");
const Treatment = require("../models/Treatment")
const VitalSign = require("../models/VitalSign");

const { registerPatient, getHospitalRecord, getPatient } = require("./utils");
const mongoose = require("mongoose");

const {
  errorHandler,
  successHandler,
  paginateResults,
} = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");
const { createTreatment } = require("./Treatment");
const { createAssessment } = require("./Assessment");

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

const assignPatientToHCP = async (req, res) => {
  try {
    const { staffId, hospital_id } = req.body;
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

    const hospitalRecord = await HospitalRecord.findOne({ hospital_id });
    if (!hospitalRecord) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found");
    }

    const patient = await Patient.findOne({
      hospital_record: hospitalRecord._id,
    });
    if (!patient) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found");
    }

    if (!hcp.patientsAssigned.includes(hospitalRecord._id)) {
      hcp.patientsAssigned.push(hospitalRecord._id);
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
      .populate("biodata")
      .populate("hospital_record");

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

const updatePatientInfo = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { hospital_id, biodata, hospitalRecord } = req.body;

    if (!hospital_id) {
      return errorHandler(
        res,
        StatusCodes.BAD_REQUEST,
        "Hospital ID is required."
      );
    }

    // First, find the HospitalRecord using hospital_id
    const hospitalRecordDoc = await HospitalRecord.findOne({
      hospital_id,
    }).session(session);

    if (!hospitalRecordDoc) {
      await session.abortTransaction();
      session.endSession();
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Hospital record not found."
      );
    }

    // Now use the _id of the HospitalRecord to find the Patient
    const patient = await Patient.findOne({
      hospital_record: hospitalRecordDoc._id,
    })
      .populate("biodata")
      .session(session);

    if (!patient) {
      await session.abortTransaction();
      session.endSession();
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found.");
    }

    // Update biodata if provided
    if (biodata && Object.keys(biodata).length > 0) {
      // Assuming biodata is a subdocument or referenced document
      if (patient.biodata) {
        Object.assign(patient.biodata, biodata);
        await patient.biodata.save({ session });
      } else {
        // If biodata doesn't exist, create a new one
        patient.biodata = new BioData(biodata);
        await patient.biodata.save({ session });
      }
    }

    // Update hospital record if provided
    if (hospitalRecord && Object.keys(hospitalRecord).length > 0) {
      Object.assign(hospitalRecordDoc, hospitalRecord);
      await hospitalRecordDoc.save({ session });
    }

    await patient.save({ session });

    await session.commitTransaction();
    session.endSession();

    const updatedPatient = await Patient.findOne({
      hospital_record: hospitalRecordDoc._id,
    })
      .populate("biodata")
      .populate("hospital_record");

    successHandler(
      res,
      StatusCodes.OK,
      updatedPatient,
      "Patient information updated successfully."
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error.");
  }
};

const transferPatient = async (req, res) => {
  try {
    const { hospital_id, receiverStaffId } = req.body;
    const senderStaffId = req.staff.staff_id;
    // Check if the sender is a healthcare professional or health information manager
    let sender = await HealthCareProfessional.findOne({
      staff_id: senderStaffId,
    });
    let isSenderHCP = true;

    if (!sender) {
      sender = await HealthInformationManager.findOne({
        staff_id: senderStaffId,
      });
      isSenderHCP = false;
      if (!sender) {
        return errorHandler(
          res,
          StatusCodes.UNAUTHORIZED,
          "Unauthorized: Sender not found"
        );
      }
    }

    // Check if the receiver is an admin healthcare professional
    const receiver = await HealthCareProfessional.findOne({
      staff_id: receiverStaffId,
      isAdmin: true,
    });
    if (!receiver) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Receiver not found or is not an admin"
      );
    }

    // If sender is HCP, check if their profession is different from the receiver's
    if (isSenderHCP && sender.profession === receiver.profession) {
      return errorHandler(
        res,
        StatusCodes.BAD_REQUEST,
        "Cannot transfer to the same profession"
      );
    }

    // Find the patient's hospital record
    const hospitalRecord = await HospitalRecord.findOne({ hospital_id });
    if (!hospitalRecord) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found");
    }

    // Add patient to receiver's receivedPatients
    receiver.receivedPatients.push({
      patient: hospitalRecord._id,
      receivedFrom: senderStaffId,
      timestamp: new Date(),
      status: "pending",
    });
    await receiver.save();

    // Add patient to sender's sentPatients
    sender.sentPatients.push({
      patient: hospitalRecord._id,
      sentTo: receiverStaffId,
      timestamp: new Date(),
      status: "pending",
    });
    await sender.save();

    successHandler(res, StatusCodes.OK, {
      message: "Patient transferred successfully",
    });
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const acceptPatient = async (req, res) => {
  try {
    const { hospital_id } = req.body;
    const receiverStaffId = req.staff.staff_id;

    // Check if the receiver is an admin healthcare professional
    const receiver = await HealthCareProfessional.findOne({
      staff_id: receiverStaffId,
      isAdmin: true,
    });
    if (!receiver) {
      return errorHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        "Unauthorized: Only admin can accept patients"
      );
    }

    // Find the patient's hospital record
    const hospitalRecord = await HospitalRecord.findOne({ hospital_id });
    if (!hospitalRecord) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found");
    }

    // Find the received patient in receiver's receivedPatients
    const receivedPatientIndex = receiver.receivedPatients.findIndex(
      (p) => p.patient.toString() === hospitalRecord._id.toString()
    );
    if (receivedPatientIndex === -1) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Transfer request not found"
      );
    }

    const senderStaffId =
      receiver.receivedPatients[receivedPatientIndex].receivedFrom;

    // Update receiver's receivedPatients
    receiver.receivedPatients[receivedPatientIndex].status = "accepted";
    await receiver.save();

    // Update sender's sentPatients
    let sender = await HealthCareProfessional.findOne({
      staff_id: senderStaffId,
    });
    let isSenderHCP = true;
    if (!sender) {
      sender = await HealthInformationManager.findOne({
        staff_id: senderStaffId,
      });
      isSenderHCP = false;
    }

    if (sender) {
      const sentPatientIndex = sender.sentPatients.findIndex(
        (p) =>
          p.patient.toString() === hospitalRecord._id.toString() &&
          p.sentTo === receiverStaffId
      );
      if (sentPatientIndex !== -1) {
        sender.sentPatients[sentPatientIndex].status = "accepted";
        await sender.save();
      }
    }

    successHandler(res, StatusCodes.OK, {
      message: "Patient accepted successfully",
    });
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const rejectPatient = async (req, res) => {
  try {
    const { hospital_id } = req.body;
    const receiverStaffId = req.staff.staff_id;

    // Check if the receiver is an admin healthcare professional
    const receiver = await HealthCareProfessional.findOne({
      staff_id: receiverStaffId,
      isAdmin: true,
    });
    if (!receiver) {
      return errorHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        "Unauthorized: Only admin can reject patients"
      );
    }

    // Find the patient's hospital record
    const hospitalRecord = await HospitalRecord.findOne({ hospital_id });
    if (!hospitalRecord) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found");
    }

    // Find and remove the patient from receiver's receivedPatients
    const receivedPatientIndex = receiver.receivedPatients.findIndex(
      (p) => p.patient.toString() === hospitalRecord._id.toString()
    );
    if (receivedPatientIndex === -1) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Transfer request not found"
      );
    }

    const senderStaffId =
      receiver.receivedPatients[receivedPatientIndex].receivedFrom;
    receiver.receivedPatients.splice(receivedPatientIndex, 1);
    await receiver.save();

    // Update sender's sentPatients
    let sender = await HealthCareProfessional.findOne({
      staff_id: senderStaffId,
    });
    let isSenderHCP = true;
    if (!sender) {
      sender = await HealthInformationManager.findOne({
        staff_id: senderStaffId,
      });
      isSenderHCP = false;
    }

    if (sender) {
      const sentPatientIndex = sender.sentPatients.findIndex(
        (p) =>
          p.patient.toString() === hospitalRecord._id.toString() &&
          p.sentTo === receiverStaffId
      );
      if (sentPatientIndex !== -1) {
        sender.sentPatients[sentPatientIndex].status = "rejected";
        await sender.save();
      }
    }

    successHandler(res, StatusCodes.OK, {
      message: "Patient rejected and removed successfully",
    });
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getAdminJurisdictionPatients = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const adminStaffId = req.staff.staff_id;
    // Find the admin healthcare professional
    const adminHCP = await HealthCareProfessional.findOne({
      staff_id: adminStaffId,
      isAdmin: true,
    }).session(session);
    if (!adminHCP) {
      await session.abortTransaction();
      session.endSession();
      return errorHandler(
        res,
        StatusCodes.UNAUTHORIZED,
        "Unauthorized: Only admin healthcare professionals can access this"
      );
    }

    // Get all healthcare professionals of the same profession
    const sameProfessionHCPs = await HealthCareProfessional.find({
      profession: adminHCP.profession,
    }).session(session);

    // Get all patients assigned to the admin
    const adminAssignedPatients = await Patient.find({
      hospital_record: { $in: adminHCP.patientsAssigned },
    })
      .populate("biodata", "name")
      .populate("hospital_record", "hospital_id createdAt")
      .select("biodata hospital_record")
      .session(session);

    // Get all patients assigned to other HCPs of the same profession
    const otherHCPsAssignedPatients = await Promise.all(
      sameProfessionHCPs.map(async (hcp) => {
        if (hcp.staff_id !== adminStaffId) {
          const patients = await Patient.find({
            hospital_record: { $in: hcp.patientsAssigned },
          })
            .populate("biodata", "name")
            .populate("hospital_record", "hospital_id createdAt")
            .select("biodata hospital_record")
            .session(session);
          return { hcp: { staff_id: hcp.staff_id, name: hcp.name }, patients };
        }
        return null;
      })
    );

    // Get all patients received by the admin
    const receivedPatients = await Promise.all(
      adminHCP.receivedPatients.map(async (receivedPatient) => {
        const patient = await Patient.findOne({
          hospital_record: receivedPatient.patient,
        })
          .populate("biodata", "name")
          .populate("hospital_record", "hospital_id createdAt")
          .select("biodata hospital_record")
          .session(session);
        return { ...patient.toObject(), status: receivedPatient.status };
      })
    );

    // Filter out assigned patients from received patients
    const uniqueReceivedPatients = receivedPatients.filter(
      (receivedPatient) =>
        !adminAssignedPatients.some(
          (assignedPatient) =>
            assignedPatient.hospital_record.hospital_id ===
            receivedPatient.hospital_record.hospital_id
        ) &&
        ["pending", "rejected", "accepted"].includes(receivedPatient.status)
    );

    await session.commitTransaction();
    session.endSession();

    const result = {
      assignedToAdmin: adminAssignedPatients.map((patient) => ({
        name: patient.biodata.name,
        hospital_id: patient.hospital_record.hospital_id,
        dateOfRegistration: patient.hospital_record.createdAt,
      })),
      assignedToOtherHCPs: otherHCPsAssignedPatients
        .filter(Boolean)
        .map(({ hcp, patients }) => ({
          hcp: { staff_id: hcp.staff_id, name: hcp.name },
          patients: patients.map((patient) => ({
            name: patient.biodata.name,
            hospital_id: patient.hospital_record.hospital_id,
            dateOfRegistration: patient.hospital_record.createdAt,
          })),
        })),
      receivedPatients: uniqueReceivedPatients.map((patient) => ({
        name: patient.biodata.name,
        hospital_id: patient.hospital_record.hospital_id,
        dateOfRegistration: patient.hospital_record.createdAt,
        status: patient.status,
      })),
    };

    successHandler(
      res,
      StatusCodes.OK,
      result,
      "Patients under admin's jurisdiction retrieved successfully"
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getAssignedPatients = async (req, res) => {
  try {
    const staffId = req.staff.staff_id;

    // Find the healthcare professional
    const hcp = await HealthCareProfessional.findOne({ staff_id: staffId });
    if (!hcp) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Healthcare professional not found"
      );
    }

    // Get all patients assigned to this healthcare professional
    const patients = await Patient.find({
      hospital_record: { $in: hcp.patientsAssigned },
    })
      .populate("biodata")
      .populate("hospital_record")
      .populate("assessments")
      .populate("treatments")
      .populate("discharges")
      .populate("evaluations");

    // Format the patient data similar to getPatientController
    const formattedPatients = patients.map((patient) => ({
      _id: patient._id,
      biodata: patient.biodata,
      hospital_record: patient.hospital_record,
      assessments: patient.assessments,
      treatments: patient.treatments,
      discharges: patient.discharges,
      evaluations: patient.evaluations,
    }));

    successHandler(
      res,
      StatusCodes.OK,
      formattedPatients,
      "Assigned patients fetched successfully."
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error.");
  }
};

const createVitalSignController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { hospital_id, vital_sign_data } = req.body;

    if (!hospital_id || !vital_sign_data) {
      return errorHandler(
        res,
        StatusCodes.BAD_REQUEST,
        "Hospital ID and vital sign data are required."
      );
    }

    // Find the patient using hospital_id
    const hospitalRecord = await HospitalRecord.findOne({
      hospital_id,
    }).session(session);
    if (!hospitalRecord) {
      await session.abortTransaction();
      session.endSession();
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Hospital record not found."
      );
    }

    const patient = await Patient.findOne({
      hospital_record: hospitalRecord._id,
    }).session(session);
    if (!patient) {
      await session.abortTransaction();
      session.endSession();
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found.");
    }

    // Create new vital sign record
    const vitalSign = new VitalSign(vital_sign_data);
    await vitalSign.save({ session });

    // Add vital sign to patient's vital_signs array
    patient.vital_signs.push(vitalSign._id);
    await patient.save({ session });

    await session.commitTransaction();
    session.endSession();

    successHandler(
      res,
      StatusCodes.CREATED,
      vitalSign,
      "Vital sign record created successfully."
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating vital sign record:", error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error.");
  }
};

// ... existing imports ...

const getPatientFullDetails = async (req, res) => {
  try {
    const { hospital_id } = req.body;

    if (!hospital_id) {
      return errorHandler(
        res,
        StatusCodes.BAD_REQUEST,
        "Hospital ID is required."
      );
    }

    // Find the hospital record
    const hospitalRecord = await HospitalRecord.findOne({ hospital_id });
    if (!hospitalRecord) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Hospital record not found.");
    }

    // Find the patient and populate all related data
    const patient = await Patient.findOne({ hospital_record: hospitalRecord._id })
      .populate('biodata')
      .populate('hospital_record')
      .populate('vital_signs')
      .populate('assessments')
      .populate('treatments')
      .populate('discharges')
      .populate('evaluations');

    if (!patient) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Patient not found.");
    }

    // Format the patient data
    const formattedPatient = {
      _id: patient._id,
      biodata: patient.biodata,
      hospital_record: patient.hospital_record,
      vital_signs: patient.vital_signs,
      assessments: patient.assessments,
      treatments: patient.treatments,
      discharges: patient.discharges,
      evaluations: patient.evaluations,
    };

    successHandler(
      res,
      StatusCodes.OK,
      formattedPatient,
      "Patient full details fetched successfully."
    );
  } catch (error) {
    console.error("Error fetching patient full details:", error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error.");
  }
};




module.exports = {
  registerPatientController,
  getHospitalRecordController,
  getPatientController,
  createAssessmentController,
  createTreatmentController,
  assignPatientToHCP,
  updateSessionCount,
  updateNightCount,
  updateMortalityStatus,
  createDischargeController,
  createEvaluationController,
  getAllPatients,
  updatePatientInfo,
  transferPatient,
  acceptPatient,
  rejectPatient,
  getAdminJurisdictionPatients,
  getAssignedPatients,
  createVitalSignController,
  getPatientFullDetails
};
