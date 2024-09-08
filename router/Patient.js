const {
	registerPatientController,
	getHospitalRecordController,
	getPatientController,
	createAssessmentController,
	createTreatmentController,
	assignPatientToHealthcareProfessional,
	createDischargeController,
	createEvaluationController,
	updateMortalityStatus,
	updateSessionCount,
	updateNightCount
} = require('../controllers/Patient');

const router = require('express').Router();

router.route('/register').post(registerPatientController);
router.route('/hospital-records').post(getHospitalRecordController);
router.route('/').post(getPatientController);
router.route('/assessment').post(createAssessmentController);
router.route('/treatment').post(createTreatmentController);
router.route('/assign-patient').post(assignPatientToHealthcareProfessional);
router.route('/discharge').post(createDischargeController);
router.route('/evaluation').post(createEvaluationController);
router.route('/mortality-status').post(updateMortalityStatus);
router.route('/session-count').post(updateSessionCount);
router.route('/night-count').post(updateNightCount);


module.exports = router;
