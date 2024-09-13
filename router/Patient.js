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
  getPatientFullDetails
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
router.route("/full-details").post(getPatientFullDetails);

//protected routes
router.use(authenticateStaff);

router.route("/assigned-patients").get(getAssignedPatients);
router.route("/assign-patient").post(assignPatientToHCP);
router.route("/transfer-patient").post(transferPatient);
router.route("/accept-patient").post(acceptPatient);
router.route("/reject-patient").post(rejectPatient);
router.route("/admin-jurisdiction").get(getAdminJurisdictionPatients);
module.exports = router;
