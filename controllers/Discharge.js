const Discharge = require("../models/Discharge");
const HospitalRecord = require("../models/HospitalRecord");
const DischargeTemplate = require("../models/DischargeTemplate");
const { errorHandler } = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");

const createDischarge = async (
  template_id,
  discharge_data,
  hospital_id,
  session
) => {
  const template = await DischargeTemplate.findById(template_id).session(session);
  const hospitalRecord = await HospitalRecord.findOne({
    hospital_id: hospital_id,
  }).session(session);

  if (!template) {
    throw new Error("Discharge Template not found");
  }

  if (!hospitalRecord) {
    throw new Error("Hospital Record not found");
  }

  const discharge = new Discharge({
    template: template._id,
    hospital_record: hospitalRecord._id,
    discharge_data: discharge_data,
  });

  await discharge.save({ session });

  const fullDischarge = await Discharge.findById(discharge._id)
    .populate({
      path: "template",
      select: "name profession",
    })
    .session(session);

  return {
    discharge: fullDischarge,
    hospitalRecordId: hospitalRecord._id,
  };
};

const getDischargeById = async (discharge_id, res) => {
  try {
    const discharge = await Discharge.findById(discharge_id).lean();

    if (!discharge) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Discharge not found");
    }

    // Convert discharge_data Map to a plain object
    discharge.discharge_data = Object.fromEntries(
      Array.from(discharge.discharge_data, ([sectionKey, sectionValue]) => [
        sectionKey,
        Object.fromEntries(sectionValue),
      ])
    );

    return discharge;
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getDischargeByHospitalRecord = async (hospital_record_id, res) => {
  try {
    const discharges = await Discharge.find({
      hospital_record: hospital_record_id,
    }).lean();

    // Convert discharge_data Map to a plain object for each discharge
    const formattedDischarges = discharges.map(discharge => ({
      ...discharge,
      discharge_data: Object.fromEntries(
        Array.from(discharge.discharge_data, ([sectionKey, sectionValue]) => [
          sectionKey,
          Object.fromEntries(sectionValue),
        ])
      ),
    }));

    return formattedDischarges;
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = { createDischarge, getDischargeById, getDischargeByHospitalRecord }
