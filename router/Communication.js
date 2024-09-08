const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  createServiceRequest,
  getServiceRequests,
  updateServiceRequest
} = require('../controllers/CommunicationController');
const authenticateStaff = require('../middleware/authentication');

router.use(authenticateStaff);

router.post('/messages', sendMessage);
router.get('/messages/:patientId', getMessages);
router.post('/service-requests', createServiceRequest);
router.get('/service-requests', getServiceRequests);
router.patch('/service-requests/:requestId', updateServiceRequest);

module.exports = router;
