const Assessment = require('../../models/Assessment');
const HospitalRecord = require('../../models/HospitalRecord');
const AssessmentTemplate = require('../../models/AssessmentTemplate');
const { errorHandler } = require('../../utils/utils');
const { StatusCodes } = require('http-status-codes');

const createAssessment = async (
	template_name,
	assessment_data,
	res,
	hospital_id,
	session
) => {
	try {
		const template = await AssessmentTemplate.findOne({
			name: template_name,
		}).session(session);

		const hospitalRecord = await HospitalRecord.findOne({
			hospital_id: hospital_id,
		}).session(session);

		if (!template) {
			return errorHandler(
				res,
				StatusCodes.NOT_FOUND,
				'Assessment Template not found'
			);
		}

		if (!hospitalRecord) {
			return errorHandler(
				res,
				StatusCodes.NOT_FOUND,
				'Hospital Record not found'
			);
		}

		for (const [fieldName, fieldProps] of template.fields) {
			if (
				fieldProps.required &&
				!assessment_data.hasOwnProperty(fieldName)
			) {
				return errorHandler(
					res,
					StatusCodes.BAD_REQUEST,
					`Field ${fieldName} is required`
				);
			}
		}

		const assessment = new Assessment({
			template: template._id,
			hospital_record: hospitalRecord._id,
			assessment_data: { ...assessment_data },
		});

		await assessment.save({ session });

		const fullAssessment = await Assessment.findById(assessment._id)
			.populate({
				path: 'template',
				select: 'name profession',
			})
			.session(session);

		return {
			assessment: fullAssessment,
			hospitalRecordId: hospitalRecord._id,
		};
	} catch (error) {
		throw error;
	}
};

module.exports = createAssessment;
