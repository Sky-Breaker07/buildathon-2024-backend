const { StatusCodes } = require("http-status-codes");
const { errorHandler } = require("../utils/utils");

const receiveTask = async (req, res) => {
  try {
    console.log('Received task:', req.body);
    res.status(StatusCodes.OK).json({ message: 'Task received' });
  } catch (error) {
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error: ' + error.message);
  }
};

module.exports = {
  receiveTask
};
