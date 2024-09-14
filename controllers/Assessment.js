const Assessment = require("../models/Assessment");
const HospitalRecord = require("../models/HospitalRecord");
const AssessmentTemplate = require("../models/AssessmentTemplate");
const { errorHandler } = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");

const createAssessment = async (
  template_id,
  assessment_data,
  hospital_id,
  session
) => {
  const template = await AssessmentTemplate.findById(template_id).session(session);
  const hospitalRecord = await HospitalRecord.findOne({
    hospital_id: hospital_id,
  }).session(session);

  if (!template) {
    throw new Error("Assessment Template not found");
  }

  if (!hospitalRecord) {
    throw new Error("Hospital Record not found");
  }

  const assessment = new Assessment({
    template: template._id,
    hospital_record: hospitalRecord._id,
    assessment_data: assessment_data,
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
};

const getAssessmentById = async (assessment_id, res) => {
  try {
    const assessment = await Assessment.findById(assessment_id).lean();

    if (!assessment) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Assessment not found");
    }

    // Convert assessment_data Map to a plain object
    assessment.assessment_data = Object.fromEntries(
      Array.from(assessment.assessment_data, ([sectionKey, sectionValue]) => [
        sectionKey,
        Object.fromEntries(sectionValue),
      ])
    );

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
    }).lean();

    // Convert assessment_data Map to a plain object for each assessment
    const formattedAssessments = assessments.map(assessment => ({
      ...assessment,
      assessment_data: Object.fromEntries(
        Array.from(assessment.assessment_data, ([sectionKey, sectionValue]) => [
          sectionKey,
          Object.fromEntries(sectionValue),
        ])
      ),
    }));

    return formattedAssessments;
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = { createAssessment, getAssessmentById, getAssessmentByHospitalRecord }
