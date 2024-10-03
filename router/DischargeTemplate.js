const router = require("express").Router();

const {
  createDischargeTemplate,
  getDischargeTemplate,
  getDischargeTemplatesByProfession,
  getAllDischargeTemplates,
  updateDischargeTemplate,
  deleteDischargeTemplate,
} = require("../controllers/DischargeTemplate");

router.route("/").post(createDischargeTemplate);
router.route("/:id").get(getDischargeTemplate);
router.route("/:id").patch(updateDischargeTemplate);
router.route("/profession/:profession").get(getDischargeTemplatesByProfession);
router.route("/all").get(getAllDischargeTemplates);
router.route("/:id").delete(deleteDischargeTemplate);
module.exports = router;
