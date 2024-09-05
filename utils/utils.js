const errorHandler = (res, statusCode, message) => {
	res.status(statusCode).json({
		status: 'Failed',
		message,
	});
};

const successHandler = (res, statusCode, data, message) => {
	res.status(statusCode).json({
		status: 'Success',
		data,
		message,
	});
};

module.exports = {
	errorHandler,
	successHandler,
};
