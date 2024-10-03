const express = require('express');
const router = express.Router();
const {
  createReferralTemplate,
  getReferralTemplate,
  getReferralTemplatesByProfession,
  getAllReferralTemplates,
  updateReferralTemplate,
  deleteReferralTemplate,
} = require('../controllers/ReferralTemplate');


router.post('/', createReferralTemplate);
router.get('/:id', getReferralTemplate);
router.get('/profession/:profession', getReferralTemplatesByProfession);
router.get('/', getAllReferralTemplates);
router.patch('/:id', updateReferralTemplate);
router.delete('/:id', deleteReferralTemplate);

module.exports = router;
