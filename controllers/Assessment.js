const Assessment = require("../models/Assessment");
const HospitalRecord = require("../models/HospitalRecord");
const AssessmentTemplate = require("../models/AssessmentTemplate");
const { errorHandler } = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");

const createAssessment = async (
  template_name,
  assessment_data,
  res,
  hospital_id,
  session
) => {
  try {
    const template = await AssessmentTemplate.findOne({
      name: template_name,
    }).session(session);

    const hospitalRecord = await HospitalRecord.findOne({
      hospital_id: hospital_id,
    }).session(session);

    if (!template) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Assessment Template not found"
      );
    }

    if (!hospitalRecord) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Hospital Record not found"
      );
    }

    for (const [fieldName, fieldProps] of template.fields) {
      if (fieldProps.required && !assessment_data.hasOwnProperty(fieldName)) {
        return errorHandler(
          res,
          StatusCodes.BAD_REQUEST,
          `Field ${fieldName} is required`
        );
      }
    }

    const assessment = new Assessment({
      template: template._id,
      hospital_record: hospitalRecord._id,
      assessment_data: { ...assessment_data },
    });

    await assessment.save({ session });

    const fullAssessment = await Assessment.findById(assessment._id)
      .populate({
        path: "template",
        select: "name profession",
      })
      .session(session);

    return {
      assessment: fullAssessment,
      hospitalRecordId: hospitalRecord._id,
    };
  } catch (error) {
    throw error;
  }
};

const getAssessmentById = async (assessment_id, res) => {
  try {
    const assessment = await Assessment.findById(assessment_id);

    if (!assessment) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Assessment not found");
    }

    return assessment;
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getAssessmentByHospitalRecord = async (hospital_record_id, res) => {
  try {
    const assessments = await Assessment.find({
      hospital_record: hospital_record_id,
    });

    return assessments;
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = {createAssessment, getAssessmentById, getAssessmentByHospitalRecord}
