// Module imports
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

// File imports
const connectDB = require('./db/conn');
const patientRouter = require('./router/Patient');

// App Setup
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/v1/patients', patientRouter);

const startServer = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		app.listen(PORT, () =>
			console.log(`Server started successfully on port: ${PORT}`)
		);
	} catch (error) {
		console.error('Error starting server: ', error);
	}
};

startServer();
