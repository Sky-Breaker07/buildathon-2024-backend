const express = require('express');
const router = express.Router();
const { receiveTask } = require('../controllers/Tasker');

router.post('/notifications', receiveTask);

module.exports = router;