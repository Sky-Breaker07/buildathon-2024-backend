const express = require('express');
const router = express.Router();
const authenticateStaff = require('../middleware/authentication');

const {
  registerSuperAdmin,
  registerAdminHealthcareProfessional,
  registerHealthcareProfessional,
  registerHealthInformationManager,
  getAllHealthcareProfessionals,
  getAdminHealthcareProfessionals,
  getHealthcareProfessionalsByProfession,
  getAllHealthInformationManagers,
  changeHealthcareProfessionalAdminStatus,
  removeHealthcareProfessional,
  removeHealthInformationManager,
  removeAdminHealthcareProfessional,
  superAdminExists
} = require('../controllers/staff');

// Public routes
router.post('/register-super-admin', registerSuperAdmin);
router.get('/super-admin-exists', superAdminExists);
// Protected routes
router.use(authenticateStaff);

// Healthcare Professional routes
router.post('/register-admin-hcp', registerAdminHealthcareProfessional);
router.post('/register-hcp', registerHealthcareProfessional);
router.get('/hcp', getAllHealthcareProfessionals);
router.get('/admin-hcp', getAdminHealthcareProfessionals);
router.get('/hcp/:profession', getHealthcareProfessionalsByProfession);
router.patch('/hcp/:staff_id/admin-status', changeHealthcareProfessionalAdminStatus);
router.delete('/hcp/:staff_id', removeHealthcareProfessional);

// Health Information Manager routes
router.post('/register-him', registerHealthInformationManager);
router.get('/him', getAllHealthInformationManagers);
router.delete('/him/:staff_id', removeHealthInformationManager);
router.delete('/admin-hcp/:staff_id', removeAdminHealthcareProfessional);
module.exports = router;
