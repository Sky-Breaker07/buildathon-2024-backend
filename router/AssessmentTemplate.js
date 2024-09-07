const router = require("express").Router();

const createAssessmentTemplate = require("../controllers/createAssessmentTemplate");
const {
  getAssessmentTemplate,
} = require("../controllers/getAssessmentTemplate");
const updateAssessmentTemplate = require("../controllers/updateAssessmentTemplate");

router.route("/").post(createAssessmentTemplate);
router.route("/:id").get(getAssessmentTemplate);
router.route("/:id").put(updateAssessmentTemplate);

module.exports = router;
