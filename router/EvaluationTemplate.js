const router = require("express").Router();

const {
  createEvaluationTemplate,
  getEvaluationTemplate,
  getEvaluationTemplatesByProfession,
  getAllEvaluationTemplates,
  updateEvaluationTemplate,
  deleteEvaluationTemplate,
} = require("../controllers/EvaluationTemplate");

router.route("/").post(createEvaluationTemplate);
router.route("/:id").get(getEvaluationTemplate);
router.route("/:id").patch(updateEvaluationTemplate);
router.route("/profession/:profession").get(getEvaluationTemplatesByProfession);
router.route("/all").get(getAllEvaluationTemplates);
router.route("/:id").delete(deleteEvaluationTemplate);
module.exports = router;
