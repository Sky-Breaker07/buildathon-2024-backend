const router = require("express").Router();

const {
  createDischargeTemplate,
  getDischargeTemplate,
  getDischargeTemplatesByProfession,
  getAllDischargeTemplates,
  updateDischargeTemplate,
} = require("../controllers/DischargeTemplate");

router.route("/").post(createDischargeTemplate);
router.route("/:id").get(getDischargeTemplate);
router.route("/:id").put(updateDischargeTemplate);
router.route("/profession/:profession").get(getDischargeTemplatesByProfession);
router.route("/all").get(getAllDischargeTemplates);

module.exports = router;
