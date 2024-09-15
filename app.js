// Module imports
const dotenv = require('dotenv');
dotenv.config();
const cron = require('node-cron');

const express = require('express');
const cors = require('cors');

// File imports
const connectDB = require('./db/conn');
const patientRouter = require('./router/Patient');
const assessmentTemplateRouter = require('./router/AssessmentTemplate');
const staffRouter = require('./router/staff');
const communicationRouter = require('./router/Communication');
const dischargeTemplateRouter = require('./router/DischargeTemplate');
const evaluationTemplateRouter = require('./router/EvaluationTemplate');
const treatmentTemplateRouter = require('./router/TreatmentTemplate');
const referralTemplateRouter = require('./router/ReferralTemplate');
const authRouter = require('./router/auth');
const statisticsRouter = require('./router/Statistics');
const { updatePastAppointments } = require('./controllers/Patient');
// App Setup
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/v1/patients', patientRouter);
app.use('/api/v1/assessment-template', assessmentTemplateRouter);
app.use('/api/v1/staff', staffRouter);
app.use('/api/v1/communication', communicationRouter);
app.use('/api/v1/discharge-template', dischargeTemplateRouter);
app.use('/api/v1/evaluation-template', evaluationTemplateRouter);
app.use('/api/v1/treatment-template', treatmentTemplateRouter);
app.use('/api/v1/referral-template', referralTemplateRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/statistics', statisticsRouter);
cron.schedule('0 0 * * *', () => {
  console.log('Running daily appointment update');
  updatePastAppointments();
});

const startConnection = async () => {
	try {
		const isConnectionSuccessful = await connectDB(process.env.MONGO_URI);

		if (isConnectionSuccessful) {
			app.listen(
				PORT,
				console.log(
					`Connection to the Database Successful. Server is listening on port ${PORT}`
				)
			);
		} else {
			console.log('Connection Failed');
		}
	} catch (error) {
		console.log(error);
	}
};

startConnection();
