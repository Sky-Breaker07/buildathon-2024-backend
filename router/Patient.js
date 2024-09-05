const { registerPatientController } = require('../controllers/Patient');

const router = require('express').Router();

router.route('/register').post(registerPatientController);

module.exports = router;
