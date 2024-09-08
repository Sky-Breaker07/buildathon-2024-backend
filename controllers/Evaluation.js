const Evaluation = require("../models/Evaluation");
const HospitalRecord = require("../models/HospitalRecord");
const EvaluationTemplate = require("../models/EvaluationTemplate");
const { errorHandler, successHandler } = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");

const createEvaluation = async (
  template_name,
  evaluation_data,
  res,
  hospital_id,
  session
) => {
  try {
    const template = await EvaluationTemplate.findOne({
      name: template_name,
    }).session(session);

    if (!template) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Evaluation Template not found"
      );
    }

    const hospitalRecord = await HospitalRecord.findOne({
      hospital_id: hospital_id,
    }).session(session);

    if (!hospitalRecord) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Hospital Record not found"
      );
    }

    for (const [fieldName, fieldProps] of template.fields) {
      if (fieldProps.required && !evaluation_data.hasOwnProperty(fieldName)) {
        return errorHandler(
          res,
          StatusCodes.BAD_REQUEST,
          `Field ${fieldName} is required`
        );
      }
    }

    const evaluation = new Evaluation({
      template: template._id,
      hospital_record: hospitalRecord._id,
      evaluation_data: { ...evaluation_data },
    });

    await evaluation.save({ session });

    const fullEvaluation = await Evaluation.findById(evaluation._id)
      .populate({
        path: "template",
        select: "name profession",
      })
      .session(session);

    return {
      evaluation: fullEvaluation,
      hospitalRecordId: hospitalRecord._id,
    };
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getEvaluationById = async (evaluation_id, res) => {
  try {
    const evaluation = await Evaluation.findById(evaluation_id);

    if (!evaluation) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Evaluation not found");
    }

    return successHandler(res, StatusCodes.OK, evaluation, "Evaluation found");
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getEvaluationByHospitalRecord = async (hospital_record_id, res) => {
  try {
    const evaluations = await Evaluation.find({
      hospital_record: hospital_record_id,
    });

    return successHandler(res, StatusCodes.OK, evaluations, "Evaluations found");
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = {
  createEvaluation,
  getEvaluationById,
  getEvaluationByHospitalRecord
};
