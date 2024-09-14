const express = require('express');
const router = express.Router();
const {
  createReferralTemplate,
  getReferralTemplate,
  getReferralTemplatesByProfession,
  getAllReferralTemplates,
  updateReferralTemplate,
} = require('../controllers/ReferralTemplate');

// Create a new referral template
router.post('/', createReferralTemplate);

// Get a specific referral template by ID
router.get('/:id', getReferralTemplate);

// Get all referral templates for a specific profession
router.get('/profession/:profession', getReferralTemplatesByProfession);

// Get all referral templates
router.get('/', getAllReferralTemplates);

// Update a referral template
router.put('/:id', updateReferralTemplate);

module.exports = router;
