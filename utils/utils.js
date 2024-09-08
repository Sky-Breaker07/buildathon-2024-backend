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

const paginateResults = (page, limit) => {
	const pageNumber = parseInt(page, 10) || 1;
	const pageSize = parseInt(limit, 10) || 10;
	const skip = (pageNumber - 1) * pageSize;

	return {
		pageNumber,
		pageSize,
		skip,
	};
};

module.exports = {
	errorHandler,
	successHandler,
	paginateResults,
};
