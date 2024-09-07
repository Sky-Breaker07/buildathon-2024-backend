const AssessmentTemplate = require("../models/AssessmentTemplate");
const { StatusCodes } = require("http-status-codes");
const { errorHandler, successHandler } = require("../utils/utils");

const createAssessmentTemplate = async (req, res) => {
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

    const template = new AssessmentTemplate({
      name,
      profession,
      fields: processedFields,
    });

    await template.save();

    successHandler(
      res,
      StatusCodes.CREATED,
      template,
      "Template was created successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getAssessmentTemplate = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return errorHandler(res, StatusCodes.BAD_REQUEST, "No ID provided");
  }
  try {
    const assessmentTemplate = await AssessmentTemplate.findById(id);
    res.status(StatusCodes.OK).json({ assessmentTemplate });
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getAssessmentTemplatesByProfession = async (req, res) => {
  const { profession } = req.params;

  try {
    const assessmentTemplates = await AssessmentTemplate.find({ profession });

    if (assessmentTemplates.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No assessment templates found for this profession",
      });
    }

    res.status(StatusCodes.OK).json({ assessmentTemplates });
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getAllAssessmentTemplates = async (req, res) => {
  try {
    const assessmentTemplates = await AssessmentTemplate.find();
    res.status(StatusCodes.OK).json({ assessmentTemplates });
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateAssessmentTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profession, fields } = req.body;

    const existingTemplate = await AssessmentTemplate.findById(id);

    if (!existingTemplate) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Assessment template not found"
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
      "Assessment template updated successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = {
	createAssessmentTemplate,
	getAssessmentTemplate,
	getAssessmentTemplatesByProfession,
	getAllAssessmentTemplates,
	updateAssessmentTemplate,
}
