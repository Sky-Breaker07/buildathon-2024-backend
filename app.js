// Module imports
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

// File imports
const connectDB = require("./db/conn");
const patientRouter = require("./router/Patient");
const assessmentTemplateRouter = require("./router/AssessmentTemplate");
const staffRouter = require("./router/staff");
const communicationRouter = require('./router/Communication');
const dischargeTemplateRouter = require('./router/DischargeTemplate');
const evaluationTemplateRouter = require('./router/EvaluationTemplate');
const authRouter = require('./router/auth');

// App Setup
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/assessment-template", assessmentTemplateRouter);
app.use("/api/v1/staff", staffRouter);
app.use('/api/v1/communication', communicationRouter);
app.use('/api/discharge-templates', dischargeTemplateRouter);
app.use('/api/evaluation-templates', evaluationTemplateRouter);
app.use('/api/v1/auth', authRouter);

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
      console.log("Connection Failed");
    }
  } catch (error) {
    console.log(error);
  }
};

startConnection();