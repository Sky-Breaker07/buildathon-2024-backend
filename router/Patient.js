const {
	registerPatientController,
	getHospitalRecordController,
	getPatientController,
	createAssessmentController,
	createTreatmentController
} = require('../controllers/Patient');

const router = require('express').Router();

router.route('/register').post(registerPatientController);
router.route('/hospital-records').post(getHospitalRecordController);
router.route('/').post(getPatientController);
router.route('/assessment').post(createAssessmentController);
router.route('/treatment').post(createTreatmentController);

module.exports = router;
