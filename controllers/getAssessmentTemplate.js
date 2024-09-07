const { AssessmentTemplate } = require('../models');
const { StatusCodes } = require('http-status-codes');
const { errorHandler } = require('../utils/errorHandler');

const getAssessmentTemplate = async (req, res) => {
    const { profession, name } = req.body;

    try {
        const assessmentTemplate = await AssessmentTemplate.findOne({ profession, name });
        
        if (!assessmentTemplate) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                message: 'Assessment template not found' 
            });
        }

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
                message: 'No assessment templates found for this profession' 
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

module.exports = { 
    getAssessmentTemplate, 
    getAssessmentTemplatesByProfession,
    getAllAssessmentTemplates
};