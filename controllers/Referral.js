const Referral = require("../models/Referral");
const HospitalRecord = require("../models/HospitalRecord");
const ReferralTemplate = require("../models/ReferralTemplate");
const { errorHandler } = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");

const createReferral = async (
  template_id,
  referral_data,
  hospital_id,
  session
) => {
  const template = await ReferralTemplate.findById(template_id).session(session);
  const hospitalRecord = await HospitalRecord.findOne({
    hospital_id: hospital_id,
  }).session(session);

  if (!template) {
    throw new Error("Referral Template not found");
  }

  if (!hospitalRecord) {
    throw new Error("Hospital Record not found");
  }

  const referral = new Referral({
    template: template._id,
    hospital_record: hospitalRecord._id,
    referral_data: referral_data,
  });

  await referral.save({ session });

  const fullReferral = await Referral.findById(referral._id)
    .populate({
      path: "template",
      select: "name profession",
    })
    .session(session);

  return {
    referral: fullReferral,
    hospitalRecordId: hospitalRecord._id,
  };
};

const getReferralById = async (referral_id, res) => {
  try {
    const referral = await Referral.findById(referral_id).lean();

    if (!referral) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Referral not found");
    }

    // Convert referral_data Map to a plain object
    referral.referral_data = Object.fromEntries(
      Array.from(referral.referral_data, ([sectionKey, sectionValue]) => [
        sectionKey,
        Object.fromEntries(sectionValue),
      ])
    );

    return referral;
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getReferralByHospitalRecord = async (hospital_record_id, res) => {
  try {
    const referrals = await Referral.find({
      hospital_record: hospital_record_id,
    }).lean();

    // Convert referral_data Map to a plain object for each referral
    const formattedReferrals = referrals.map(referral => ({
      ...referral,
      referral_data: Object.fromEntries(
        Array.from(referral.referral_data, ([sectionKey, sectionValue]) => [
          sectionKey,
          Object.fromEntries(sectionValue),
        ])
      ),
    }));

    return formattedReferrals;
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = { createReferral, getReferralById, getReferralByHospitalRecord }
