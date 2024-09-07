const TreatmentTemplate = require("../models/TreatmentTemplate");
const { StatusCodes } = require("http-status-codes");
const { errorHandler, successHandler } = require("../utils/utils");

const createTreatmentTemplate = async (req, res) => {
  try {
    const { name, profession, fields } = req.body;

    if (typeof fields !== "object" || Object.keys(fields).length === 0) {
      return errorHandler(
        res,
        StatusCodes.BAD_REQUEST,
        "Fields must be a non-empty object"
      );
    }

    const processedFields = new Map();
    for (const [fieldName, fieldProps] of Object.entries(fields)) {
      processedFields.set(fieldName, {
        type: fieldProps.type,
        required: fieldProps.required || false,
        options: fieldProps.options || [],
      });
    }

    const template = new TreatmentTemplate({
      name,
      profession,
      fields: processedFields,
    });

    await template.save();

    successHandler(
      res,
      StatusCodes.CREATED,
      template,
      "Treatment template was created successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getTreatmentTemplate = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return errorHandler(res, StatusCodes.BAD_REQUEST, "No ID provided");
  }
  try {
    const treatmentTemplate = await TreatmentTemplate.findById(id);
    res.status(StatusCodes.OK).json({ treatmentTemplate });
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getTreatmentTemplatesByProfession = async (req, res) => {
  const { profession } = req.params;

  try {
    const treatmentTemplates = await TreatmentTemplate.find({ profession });

    if (treatmentTemplates.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No treatment templates found for this profession",
      });
    }

    res.status(StatusCodes.OK).json({ treatmentTemplates });
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getAllTreatmentTemplates = async (req, res) => {
  try {
    const treatmentTemplates = await TreatmentTemplate.find();
    res.status(StatusCodes.OK).json({ treatmentTemplates });
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateTreatmentTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profession, fields } = req.body;

    const existingTemplate = await TreatmentTemplate.findById(id);

    if (!existingTemplate) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Treatment template not found"
      );
    }

    if (name) existingTemplate.name = name;
    if (profession) existingTemplate.profession = profession;

    if (
      fields &&
      typeof fields === "object" &&
      Object.keys(fields).length > 0
    ) {
      const processedFields = new Map();
      for (const [fieldName, fieldProps] of Object.entries(fields)) {
        processedFields.set(fieldName, {
          type: fieldProps.type,
          required: fieldProps.required || false,
          options: fieldProps.options || [],
        });
      }
      existingTemplate.fields = processedFields;
    }

    await existingTemplate.save();

    successHandler(
      res,
      StatusCodes.OK,
      existingTemplate,
      "Treatment template updated successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = {
  createTreatmentTemplate,
  getTreatmentTemplate,
  getTreatmentTemplatesByProfession,
  getAllTreatmentTemplates,
  updateTreatmentTemplate,
};
