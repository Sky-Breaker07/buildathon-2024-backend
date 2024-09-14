const express = require('express');
const router = express.Router();
const authenticateStaff = require("../middleware/authentication");
const {
  registerPatientController,
  getHospitalRecordController,
  getPatientController,
  createAssessmentController,
  createTreatmentController,
  assignPatientToHCP,
  unassignPatientFromHCP,
  createDischargeController,
  createEvaluationController,
  updateMortalityStatus,
  updateSessionCount,
  updateNightCount,
  updatePatientInfo,
  getAllPatients,
  transferPatient,
  acceptPatient,
  rejectPatient,
  getAdminJurisdictionPatients,
  getAssignedPatients,
  createVitalSignController,
  createReferralController,
  createAppointment,
  getPatientFullDetails,
  getPatientAppointments,
  cancelAppointment,
  rescheduleAppointment,
  completeAppointment
} = require("../controllers/Patient");



router.route("/register").post(registerPatientController);
router.route("/hospital-records").post(getHospitalRecordController);
router.route("/").post(getPatientController);
router.route("/assessment").post(createAssessmentController);
router.route("/treatment").post(createTreatmentController);
router.route("/discharge").post(createDischargeController);
router.route("/evaluation").post(createEvaluationController);
router.route("/mortality-status").post(updateMortalityStatus);
router.route("/session-count").patch(updateSessionCount);
router.route("/night-count").patch(updateNightCount);
router.route("/update-patient-info").patch(updatePatientInfo);
router.route("/").get(getAllPatients);
router.route("/vital-sign").post(createVitalSignController);
router.route("/referral").post(createReferralController);
router.route("/appointment").post(createAppointment);
router.route("/full-details").post(getPatientFullDetails);
router.route("/appointments").post(getPatientAppointments);
router.route("/cancel-appointment").post(cancelAppointment);
router.route("/reschedule-appointment").post(rescheduleAppointment);
router.route("/complete-appointment").post(completeAppointment);
//protected routes
router.use(authenticateStaff);

router.route("/assigned-patients").get(getAssignedPatients);
router.route("/assign-patient").post(assignPatientToHCP);
router.route("/transfer-patient").post(transferPatient);
router.route("/accept-patient").post(acceptPatient);
router.route("/reject-patient").post(rejectPatient);
router.route("/admin-jurisdiction").get(getAdminJurisdictionPatients);
router.route("/unassign-patient").post(unassignPatientFromHCP);
module.exports = router;
