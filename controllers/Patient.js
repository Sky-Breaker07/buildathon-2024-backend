const { registerPatient } = require('../utils/function');
const { errorHandler, successHandler } = require('../utils/utils');

const registerPatientController = async (req, res) => {
	try {
		const { hospitalRecord } = await registerPatient(req.body);

		successHandler(res, 201, hospitalRecord);
	} catch (error) {
		console.error(error);
		errorHandler(res, 500, 'Server Error');
	}
};

module.exports = { registerPatientController };
