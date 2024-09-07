const { AssessmentTemplate } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { errorHandler, successHandler } = require('../utils/utils');

const updateAssessmentTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, profession, fields } = req.body;

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

        if (fields && typeof fields === 'object' && Object.keys(fields).length > 0) {
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
            'Assessment template updated successfully'
        );
    } catch (error) {
        console.error(error);
        errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error');
    }
};

module.exports = updateAssessmentTemplate;
