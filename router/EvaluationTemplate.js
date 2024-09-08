const router = require("express").Router();

const {
  createEvaluationTemplate,
  getEvaluationTemplate,
  getEvaluationTemplatesByProfession,
  getAllEvaluationTemplates,
  updateEvaluationTemplate,
} = require("../controllers/EvaluationTemplate");

router.route("/").post(createEvaluationTemplate);
router.route("/:id").get(getEvaluationTemplate);
router.route("/:id").put(updateEvaluationTemplate);
router.route("/profession/:profession").get(getEvaluationTemplatesByProfession);
router.route("/all").get(getAllEvaluationTemplates);

module.exports = router;
