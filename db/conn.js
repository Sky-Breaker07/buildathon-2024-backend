const mongoose = require('mongoose');

const connectDB = async (uri) => {
	try {
		await mongoose.connect(uri);
		console.log('Connected to DB successfully');
	} catch (error) {
		console.error('Error connecting to DB: ', error);
	}
};

module.exports = connectDB;
