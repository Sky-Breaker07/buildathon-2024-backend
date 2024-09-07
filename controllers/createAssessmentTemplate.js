const AssessmentTemplate = require('../models/AssessmentTemplate');
const { StatusCodes } = require('http-status-codes');
const { errorHandler, successHandler } = require('../utils/utils');

const createAssessmentTemplate = async (req, res) => {
	try {
		const { name, profession, fields } = req.body;

		if (typeof fields !== 'object' || Object.keys(fields).length === 0) {
			return errorHandler(
				res,
				StatusCodes.BAD_REQUEST,
				'Fields must be a non-empty object'
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
			'Template was created successfully'
		);
	} catch (error) {
		console.error(error);
		errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error');
	}
};

module.exports = createAssessmentTemplate;
