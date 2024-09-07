const Assessment = require('../../models/Assessment');
const HospitalRecord = require('../../models/HospitalRecord');
const AssessmentTemplate = require('../../models/AssessmentTemplate');
const { errorHandler } = require('../../utils/utils');
const { StatusCodes } = require('http-status-codes');

const getAssessmentById = async (assessment_id, res) => {
    try {
        const assessment = await Assessment.findById(assessment_id);

        if (!assessment) {
            return errorHandler(
                res,
                StatusCodes.NOT_FOUND,
                'Assessment not found'
            );
        }

        return assessment;
    } catch (error) {
        console.error(error);
        errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error');
    }
}

const getAssessmentByHospitalRecord = async (hospital_record_id, res) => {
    try {
        const assessments = await Assessment.find({
            hospital_record: hospital_record_id,
        });

        return assessments;
    } catch (error) {
        console.error(error);
        errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error');
    }
}

module.exports = { getAssessmentById, getAssessmentByHospitalRecord };