const Treatment = require("../models/Treatment");
const HospitalRecord = require("../models/HospitalRecord");
const TreatmentTemplate = require("../models/TreatmentTemplate");
const { errorHandler } = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");

const createTreatment = async (
  template_id,
  treatment_data,
  hospital_id,
  session
) => {
  const template = await TreatmentTemplate.findById(template_id).session(session);
  const hospitalRecord = await HospitalRecord.findOne({
    hospital_id: hospital_id,
  }).session(session);

  if (!template) {
    throw new Error("Treatment Template not found");
  }

  if (!hospitalRecord) {
    throw new Error("Hospital Record not found");
  }

  const treatment = new Treatment({
    template: template._id,
    hospital_record: hospitalRecord._id,
    treatment_data: treatment_data,
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
};

const getTreatmentById = async (treatment_id, res) => {
  try {
    const treatment = await Treatment.findById(treatment_id).lean();

    if (!treatment) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Treatment not found");
    }

    // Convert treatment_data Map to a plain object
    treatment.treatment_data = Object.fromEntries(
      Array.from(treatment.treatment_data, ([sectionKey, sectionValue]) => [
        sectionKey,
        Object.fromEntries(sectionValue),
      ])
    );

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
    }).lean();

    // Convert treatment_data Map to a plain object for each treatment
    const formattedTreatments = treatments.map(treatment => ({
      ...treatment,
      treatment_data: Object.fromEntries(
        Array.from(treatment.treatment_data, ([sectionKey, sectionValue]) => [
          sectionKey,
          Object.fromEntries(sectionValue),
        ])
      ),
    }));

    return formattedTreatments;
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = { createTreatment, getTreatmentById, getTreatmentByHospitalRecord }
