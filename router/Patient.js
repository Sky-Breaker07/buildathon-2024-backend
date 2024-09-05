const {
	registerPatientController,
	getHospitalRecordController,
} = require('../controllers/Patient');

const router = require('express').Router();

router.route('/register').post(registerPatientController);
router.route('/hospital-records').post(getHospitalRecordController);

module.exports = router;
