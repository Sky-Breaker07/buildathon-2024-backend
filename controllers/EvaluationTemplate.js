const EvaluationTemplate = require("../models/EvaluationTemplate");
const { StatusCodes } = require("http-status-codes");
const { errorHandler, successHandler, paginateResults } = require("../utils/utils");

const createEvaluationTemplate = async (req, res) => {
  try {
    const { name, profession, description, fields } = req.body;

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
        label: fieldProps.label,
        placeholder: fieldProps.placeholder,
        defaultValue: fieldProps.defaultValue,
      });
    }

    const template = new EvaluationTemplate({
      name,
      profession,
      description,
      fields: processedFields,
    });

    await template.save();

    successHandler(
      res,
      StatusCodes.CREATED,
      template,
      "Evaluation template was created successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getEvaluationTemplate = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return errorHandler(res, StatusCodes.BAD_REQUEST, "No ID provided");
  }
  try {
    const evaluationTemplate = await EvaluationTemplate.findById(id);
    res.status(StatusCodes.OK).json({ evaluationTemplate });
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getEvaluationTemplatesByProfession = async (req, res) => {
  const { profession } = req.params;

  try {
    const evaluationTemplates = await EvaluationTemplate.find({ profession });

    if (evaluationTemplates.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No evaluation templates found for this profession",
      });
    }

    res.status(StatusCodes.OK).json({ evaluationTemplates });
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getAllEvaluationTemplates = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { pageNumber, pageSize, skip } = paginateResults(page, limit);

    const totalTemplates = await EvaluationTemplate.countDocuments();
    const evaluationTemplates = await EvaluationTemplate.find()
      .skip(skip)
      .limit(pageSize);

    const totalPages = Math.ceil(totalTemplates / pageSize);

    successHandler(
      res,
      StatusCodes.OK,
      {
        evaluationTemplates,
        currentPage: pageNumber,
        totalPages,
        totalTemplates,
      },
      "Evaluation templates retrieved successfully"
    );
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateEvaluationTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profession, description, fields, isActive } = req.body;

    const existingTemplate = await EvaluationTemplate.findById(id);

    if (!existingTemplate) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Evaluation template not found"
      );
    }

    if (name) existingTemplate.name = name;
    if (profession) existingTemplate.profession = profession;
    if (description) existingTemplate.description = description;
    if (isActive !== undefined) existingTemplate.isActive = isActive;

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
          label: fieldProps.label,
          placeholder: fieldProps.placeholder,
          defaultValue: fieldProps.defaultValue,
        });
      }
      existingTemplate.fields = processedFields;
    }

    await existingTemplate.save();

    successHandler(
      res,
      StatusCodes.OK,
      existingTemplate,
      "Evaluation template updated successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = {
  createEvaluationTemplate,
  getEvaluationTemplate,
  getEvaluationTemplatesByProfession,
  getAllEvaluationTemplates,
  updateEvaluationTemplate,
};
