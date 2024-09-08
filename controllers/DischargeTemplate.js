const DischargeTemplate = require("../models/DischargeTemplate");
const { StatusCodes } = require("http-status-codes");
const { errorHandler, successHandler, paginateResults } = require("../utils/utils");

const createDischargeTemplate = async (req, res) => {
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

    const template = new DischargeTemplate({
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
      "Discharge template was created successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getDischargeTemplate = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return errorHandler(res, StatusCodes.BAD_REQUEST, "No ID provided");
  }
  try {
    const dischargeTemplate = await DischargeTemplate.findById(id);
    res.status(StatusCodes.OK).json({ dischargeTemplate });
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getDischargeTemplatesByProfession = async (req, res) => {
  const { profession } = req.params;

  try {
    const dischargeTemplates = await DischargeTemplate.find({ profession });

    if (dischargeTemplates.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No discharge templates found for this profession",
      });
    }

    res.status(StatusCodes.OK).json({ dischargeTemplates });
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getAllDischargeTemplates = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { pageNumber, pageSize, skip } = paginateResults(page, limit);

    const totalTemplates = await DischargeTemplate.countDocuments();
    const dischargeTemplates = await DischargeTemplate.find()
      .skip(skip)
      .limit(pageSize);

    const totalPages = Math.ceil(totalTemplates / pageSize);

    successHandler(
      res,
      StatusCodes.OK,
      {
        dischargeTemplates,
        currentPage: pageNumber,
        totalPages,
        totalTemplates,
      },
      "Discharge templates retrieved successfully"
    );
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateDischargeTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profession, description, fields, isActive } = req.body;

    const existingTemplate = await DischargeTemplate.findById(id);

    if (!existingTemplate) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Discharge template not found"
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
      "Discharge template updated successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = {
  createDischargeTemplate,
  getDischargeTemplate,
  getDischargeTemplatesByProfession,
  getAllDischargeTemplates,
  updateDischargeTemplate,
};
