const Discharge = require("../models/Discharge");
const HospitalRecord = require("../models/HospitalRecord");
const DischargeTemplate = require("../models/DischargeTemplate");
const { errorHandler, successHandler } = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");

const createDischarge = async (
  template_name,
  discharge_data,
  res,
  hospital_id,
  session
) => {
  try {
    const template = await DischargeTemplate.findOne({
      name: template_name,
    }).session(session);

    if (!template) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Discharge Template not found"
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
      if (fieldProps.required && !discharge_data.hasOwnProperty(fieldName)) {
        return errorHandler(
          res,
          StatusCodes.BAD_REQUEST,
          `Field ${fieldName} is required`
        );
      }
    }

    const discharge = new Discharge({
      template: template._id,
      hospital_record: hospitalRecord._id,
      discharge_data: { ...discharge_data },
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
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getDischargeById = async (discharge_id, res) => {
  try {
    const discharge = await Discharge.findById(discharge_id);

    if (!discharge) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Discharge not found");
    }

    return successHandler(res, StatusCodes.OK, discharge, "Discharge found");
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getDischargeByHospitalRecord = async (hospital_record_id, res) => {
  try {
    const discharges = await Discharge.find({
      hospital_record: hospital_record_id,
    });

    return successHandler(res, StatusCodes.OK, discharges, "Discharges found");
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = {
  createDischarge,
  getDischargeById,
  getDischargeByHospitalRecord
};
