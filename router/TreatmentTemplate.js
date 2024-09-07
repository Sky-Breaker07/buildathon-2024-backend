const express = require('express');
const router = express.Router();
const {
  createTreatmentTemplate,
  getTreatmentTemplate,
  getTreatmentTemplatesByProfession,
  getAllTreatmentTemplates,
  updateTreatmentTemplate,
} = require('../controllers/TreatmentTemplate');

// Create a new treatment template
router.post('/', createTreatmentTemplate);

// Get a specific treatment template by ID
router.get('/:id', getTreatmentTemplate);

// Get all treatment templates for a specific profession
router.get('/profession/:profession', getTreatmentTemplatesByProfession);

// Get all treatment templates
router.get('/', getAllTreatmentTemplates);

// Update a treatment template
router.put('/:id', updateTreatmentTemplate);

module.exports = router;
