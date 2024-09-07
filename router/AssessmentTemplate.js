const router = require("express").Router();

const {
  createAssessmentTemplate,
  getAssessmentTemplate,
  getAssessmentTemplatesByProfession,
  getAllAssessmentTemplates,
  updateAssessmentTemplate,
} = require("../controllers/AssessmentTemplate");

router.route("/").post(createAssessmentTemplate);
router.route("/:id").get(getAssessmentTemplate);
router.route("/:id").put(updateAssessmentTemplate);
router.route("/profession/:profession").get(getAssessmentTemplatesByProfession);
router.route("/all").get(getAllAssessmentTemplates);

module.exports = router;
