const Treatment = require("../models/Treatment");
const HospitalRecord = require("../models/HospitalRecord");
const TreatmentTemplate = require("../models/TreatmentTemplate");
const { errorHandler } = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");

const createTreatment = async (
  template_name,
  treatment_data,
  res,
  hospital_id,
  session
) => {
  try {
    const template = await TreatmentTemplate.findOne({
      name: template_name,
    }).session(session);

    const hospitalRecord = await HospitalRecord.findOne({
      hospital_id: hospital_id,
    }).session(session);

    if (!template) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Treatment Template not found"
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
      if (fieldProps.required && !treatment_data.hasOwnProperty(fieldName)) {
        return errorHandler(
          res,
          StatusCodes.BAD_REQUEST,
          `Field ${fieldName} is required`
        );
      }
    }

    const treatment = new Treatment({
      template: template._id,
      hospital_record: hospitalRecord._id,
      treatment_data: { ...treatment_data },
    });

    await treatment.save({ session });

    const fullTreatment = await Treatment.findById(treatment._id)
      .populate({
        path: "template",
        select: "name profession",
      })
      .session(session);

    return {
      treatment: fullTreatment,
      hospitalRecordId: hospitalRecord._id,
    };
  } catch (error) {
    throw error;
  }
};

const getTreatmentById = async (treatment_id, res) => {
  try {
    const treatment = await Treatment.findById(treatment_id);

    if (!treatment) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Treatment not found");
    }

    return treatment;
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getTreatmentByHospitalRecord = async (hospital_record_id, res) => {
  try {
    const treatments = await Treatment.find({
      hospital_record: hospital_record_id,
    });

    return treatments;
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = {
  createTreatment,
  getTreatmentById,
  getTreatmentByHospitalRecord
};
