const router = require("express").Router();

const {
  createAssessmentTemplate,
  getAssessmentTemplate,
  getAssessmentTemplatesByProfession,
  getAllAssessmentTemplates,
  updateAssessmentTemplate,
  deleteAssessmentTemplate,
} = require("../controllers/AssessmentTemplate");

router.route("/").post(createAssessmentTemplate);
router.route("/:id").get(getAssessmentTemplate);
router.route("/:id").patch(updateAssessmentTemplate);
router.route("/profession/:profession").get(getAssessmentTemplatesByProfession);
router.route("/all").get(getAllAssessmentTemplates);
router.route("/:id").delete(deleteAssessmentTemplate);
module.exports = router;
