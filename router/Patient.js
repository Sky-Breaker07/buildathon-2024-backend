const {
	registerPatientController,
	getHospitalRecordController,
	getPatientController,
} = require('../controllers/Patient');

const router = require('express').Router();

router.route('/register').post(registerPatientController);
router.route('/hospital-records').post(getHospitalRecordController);
router.route('/').post(getPatientController);

module.exports = router;
