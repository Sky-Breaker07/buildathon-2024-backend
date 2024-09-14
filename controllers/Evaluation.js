const Evaluation = require("../models/Evaluation");
const HospitalRecord = require("../models/HospitalRecord");
const EvaluationTemplate = require("../models/EvaluationTemplate");
const { errorHandler } = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");

const createEvaluation = async (
  template_id,
  evaluation_data,
  hospital_id,
  session
) => {
  const template = await EvaluationTemplate.findById(template_id).session(session);
  const hospitalRecord = await HospitalRecord.findOne({
    hospital_id: hospital_id,
  }).session(session);

  if (!template) {
    throw new Error("Evaluation Template not found");
  }

  if (!hospitalRecord) {
    throw new Error("Hospital Record not found");
  }

  const evaluation = new Evaluation({
    template: template._id,
    hospital_record: hospitalRecord._id,
    evaluation_data: evaluation_data,
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
};

const getEvaluationById = async (evaluation_id, res) => {
  try {
    const evaluation = await Evaluation.findById(evaluation_id).lean();

    if (!evaluation) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Evaluation not found");
    }

    // Convert evaluation_data Map to a plain object
    evaluation.evaluation_data = Object.fromEntries(
      Array.from(evaluation.evaluation_data, ([sectionKey, sectionValue]) => [
        sectionKey,
        Object.fromEntries(sectionValue),
      ])
    );

    return evaluation;
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getEvaluationByHospitalRecord = async (hospital_record_id, res) => {
  try {
    const evaluations = await Evaluation.find({
      hospital_record: hospital_record_id,
    }).lean();

    // Convert evaluation_data Map to a plain object for each evaluation
    const formattedEvaluations = evaluations.map(evaluation => ({
      ...evaluation,
      evaluation_data: Object.fromEntries(
        Array.from(evaluation.evaluation_data, ([sectionKey, sectionValue]) => [
          sectionKey,
          Object.fromEntries(sectionValue),
        ])
      ),
    }));

    return formattedEvaluations;
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = { createEvaluation, getEvaluationById, getEvaluationByHospitalRecord }
