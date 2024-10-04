const AssessmentTemplate = require('../models/AssessmentTemplate');
const { StatusCodes } = require('http-status-codes');
const {
	errorHandler,
	successHandler,
	paginateResults,
} = require('../utils/utils');

const validateFields = (fields) => {
	if (typeof fields !== 'object' || Object.keys(fields).length === 0) {
		throw new Error('Fields must be a non-empty object');
	}

	for (const [sectionName, sectionFields] of Object.entries(fields)) {
		if (
			typeof sectionFields !== 'object' ||
			Object.keys(sectionFields).length === 0
		) {
			throw new Error(
				`Section ${sectionName} must be a non-empty object`
			);
		}

		for (const [fieldName, fieldProps] of Object.entries(sectionFields)) {
			if (
				typeof fieldProps !== 'object' ||
				!fieldProps.type ||
				!fieldProps.label
			) {
				throw new Error(
					`Field ${fieldName} in section ${sectionName} is invalid`
				);
			}
		}
	}
};

const createAssessmentTemplate = async (req, res) => {
	try {
		const { name, profession, description, fields } = req.body;

		'Received fields:', JSON.stringify(fields, null, 2);

		// Convert the fields object to a nested Map structure
		const fieldsMap = new Map();
		for (const [sectionKey, sectionValue] of Object.entries(fields)) {
			fieldsMap.set(sectionKey, new Map(Object.entries(sectionValue)));
		}

		const newTemplate = new AssessmentTemplate({
			name,
			profession,
			description,
			fields: fieldsMap,
		});

		const savedTemplate = await newTemplate.save();

		// Convert fields back to a plain object for the response
		const formattedTemplate = savedTemplate.toObject();
		formattedTemplate.fields = Object.fromEntries(
			Array.from(
				formattedTemplate.fields,
				([sectionKey, sectionValue]) => [
					sectionKey,
					Object.fromEntries(sectionValue),
				]
			)
		);

		'Saved template:', JSON.stringify(formattedTemplate, null, 2);

		res.status(StatusCodes.CREATED).json(formattedTemplate);
	} catch (error) {
		console.error(error);
		errorHandler(res, StatusCodes.BAD_REQUEST, error.message);
	}
};

const getAssessmentTemplate = async (req, res) => {
	try {
		const { id } = req.params;
		const template = await AssessmentTemplate.findById(id).lean();

		if (!template) {
			return errorHandler(
				res,
				StatusCodes.NOT_FOUND,
				'Template not found'
			);
		}

		// Convert fields Map to a plain object
		const formattedFields = {};
		for (const [sectionKey, sectionValue] of Object.entries(
			template.fields || {}
		)) {
			formattedFields[sectionKey] = {};
			for (const [fieldKey, fieldValue] of Object.entries(
				sectionValue || {}
			)) {
				formattedFields[sectionKey][fieldKey] = fieldValue;
			}
		}
		template.fields = formattedFields;

		'Formatted template:', JSON.stringify(template, null, 2);

		res.status(StatusCodes.OK).json(template);
	} catch (error) {
		console.error(error);
		errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error');
	}
};

const getAssessmentTemplatesByProfession = async (req, res) => {
	const { profession } = req.params;

	try {
		const assessmentTemplates = await AssessmentTemplate.find({
			profession,
		});

		if (assessmentTemplates.length === 0) {
			return res.status(StatusCodes.NOT_FOUND).json({
				message: 'No assessment templates found for this profession',
			});
		}

		res.status(StatusCodes.OK).json({ assessmentTemplates });
	} catch (error) {
		errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
	}
};

const getAllAssessmentTemplates = async (req, res) => {
	try {
		const templates = await AssessmentTemplate.find().lean();

		// Convert fields Map to a plain object for each template
		const formattedTemplates = templates.map((template) => {
			const formattedFields = {};
			for (const [sectionKey, sectionValue] of Object.entries(
				template.fields || {}
			)) {
				formattedFields[sectionKey] = {};
				for (const [fieldKey, fieldValue] of Object.entries(
					sectionValue || {}
				)) {
					formattedFields[sectionKey][fieldKey] = fieldValue;
				}
			}
			return {
				...template,
				fields: formattedFields,
			};
		});

		'Formatted templates:', JSON.stringify(formattedTemplates, null, 2);

		res.status(StatusCodes.OK).json({
			assessmentTemplates: formattedTemplates,
		});
	} catch (error) {
		console.error(error);
		errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error');
	}
};

const updateAssessmentTemplate = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, profession, description, fields, isActive } = req.body;

		const existingTemplate = await AssessmentTemplate.findById(id);

		if (!existingTemplate) {
			return errorHandler(
				res,
				StatusCodes.NOT_FOUND,
				'Assessment template not found'
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
			'Assessment template updated successfully'
		);
	} catch (error) {
		console.error(error);
		errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error');
	}
};

const deleteAssessmentTemplate = async (req, res) => {
	try {
		const { id } = req.params;

		const deletedTemplate = await AssessmentTemplate.findByIdAndDelete(id);

		if (!deletedTemplate) {
			return errorHandler(
				res,
				StatusCodes.NOT_FOUND,
				'Assessment template not found'
			);
		}

		successHandler(
			res,
			StatusCodes.OK,
			{ id: deletedTemplate._id },
			'Assessment template deleted successfully'
		);
	} catch (error) {
		console.error(error);
		errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error');
	}
};

module.exports = {
	createAssessmentTemplate,
	getAssessmentTemplate,
	getAssessmentTemplatesByProfession,
	getAllAssessmentTemplates,
	updateAssessmentTemplate,
	deleteAssessmentTemplate,
};
