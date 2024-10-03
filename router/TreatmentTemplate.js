const express = require('express');
const router = express.Router();
const {
  createTreatmentTemplate,
  getTreatmentTemplate,
  getTreatmentTemplatesByProfession,
  getAllTreatmentTemplates,
  updateTreatmentTemplate,
  deleteTreatmentTemplate,
} = require('../controllers/TreatmentTemplate');


router.post('/', createTreatmentTemplate);
router.get('/:id', getTreatmentTemplate);
router.get('/profession/:profession', getTreatmentTemplatesByProfession);
router.get('/', getAllTreatmentTemplates);
router.patch('/:id', updateTreatmentTemplate);
router.delete('/:id', deleteTreatmentTemplate);
module.exports = router;
