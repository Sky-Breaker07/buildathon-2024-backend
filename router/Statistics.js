const express = require("express");
const router = express.Router();
const {
  getPatientStatistics,
  getQueryableFields,
  getStaffStatistics
} = require("../controllers/Statistics");

router.post("/patients", getPatientStatistics);

router.get("/queryable-fields", getQueryableFields);

router.get("/staff", getStaffStatistics);

module.exports = router;
