const router = require('express').Router();

const createAssessmentTemplate = require('../controllers/createAssessmentTemplate');

router.route('/').post(createAssessmentTemplate);

module.exports = router;
