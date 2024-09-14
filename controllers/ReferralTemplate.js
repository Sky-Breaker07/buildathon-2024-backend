const ReferralTemplate = require("../models/ReferralTemplate");
const { StatusCodes } = require("http-status-codes");
const { errorHandler, successHandler, paginateResults } = require("../utils/utils");

const createReferralTemplate = async (req, res) => {
  try {
    const { name, profession, description, fields } = req.body;

    console.log("Received fields:", JSON.stringify(fields, null, 2));

    // Convert the fields object to a nested Map structure
    const fieldsMap = new Map();
    for (const [sectionKey, sectionValue] of Object.entries(fields)) {
      fieldsMap.set(sectionKey, new Map(Object.entries(sectionValue)));
    }

    const newTemplate = new ReferralTemplate({
      name,
      profession,
      description,
      fields: fieldsMap,
    });

    const savedTemplate = await newTemplate.save();

    // Convert fields back to a plain object for the response
    const formattedTemplate = savedTemplate.toObject();
    formattedTemplate.fields = Object.fromEntries(
      Array.from(formattedTemplate.fields, ([sectionKey, sectionValue]) => [
        sectionKey,
        Object.fromEntries(sectionValue),
      ])
    );

    console.log("Saved template:", JSON.stringify(formattedTemplate, null, 2));

    res.status(StatusCodes.CREATED).json(formattedTemplate);
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.BAD_REQUEST, error.message);
  }
};

const getReferralTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await ReferralTemplate.findById(id).lean();

    if (!template) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Template not found");
    }

    // Convert fields Map to a plain object
    const formattedFields = {};
    for (const [sectionKey, sectionValue] of Object.entries(template.fields || {})) {
      formattedFields[sectionKey] = {};
      for (const [fieldKey, fieldValue] of Object.entries(sectionValue || {})) {
        formattedFields[sectionKey][fieldKey] = fieldValue;
      }
    }
    template.fields = formattedFields;

    console.log('Formatted template:', JSON.stringify(template, null, 2));

    res.status(StatusCodes.OK).json(template);
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const getReferralTemplatesByProfession = async (req, res) => {
  const { profession } = req.params;

  try {
    const referralTemplates = await ReferralTemplate.find({ profession });

    if (referralTemplates.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No referral templates found for this profession",
      });
    }

    res.status(StatusCodes.OK).json({ referralTemplates });
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getAllReferralTemplates = async (req, res) => {
  try {
    const templates = await ReferralTemplate.find().lean();

    // Convert fields Map to a plain object for each template
    const formattedTemplates = templates.map(template => {
      const formattedFields = {};
      for (const [sectionKey, sectionValue] of Object.entries(template.fields || {})) {
        formattedFields[sectionKey] = {};
        for (const [fieldKey, fieldValue] of Object.entries(sectionValue || {})) {
          formattedFields[sectionKey][fieldKey] = fieldValue;
        }
      }
      return {
        ...template,
        fields: formattedFields
      };
    });

    console.log('Formatted templates:', JSON.stringify(formattedTemplates, null, 2));

    res.status(StatusCodes.OK).json({ referralTemplates: formattedTemplates });
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

const updateReferralTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profession, description, fields, isActive } = req.body;

    const existingTemplate = await ReferralTemplate.findById(id);

    if (!existingTemplate) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Referral template not found"
      );
    }

    if (name) existingTemplate.name = name;
    if (profession) existingTemplate.profession = profession;
    if (description) existingTemplate.description = description;
    if (isActive !== undefined) existingTemplate.isActive = isActive;
    if (fields) existingTemplate.fields = fields;

    await existingTemplate.save();

    successHandler(
      res,
      StatusCodes.OK,
      existingTemplate,
      "Referral template updated successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Server Error");
  }
};

module.exports = {
	createReferralTemplate,
	getReferralTemplate,
	getReferralTemplatesByProfession,
	getAllReferralTemplates,
	updateReferralTemplate,
}
