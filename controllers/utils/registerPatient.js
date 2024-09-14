const mongoose = require('mongoose');
const BioData = require('../../models/Biodata');
const HospitalRecord = require('../../models/HospitalRecord');
const Patient = require('../../models/Patient');
const { parse, isValid, format } = require('date-fns');

const registerPatient = async (bioDataInfo, appointmentInfo, patientType) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Parse the date using date-fns
    const appointmentDateTime = parse(appointmentInfo, "yyyy-MM-dd'T'HH:mm:ss.SSSX", new Date());

    if (!isValid(appointmentDateTime)) {
      throw new Error(`Invalid date-time format. Received: ${appointmentInfo.date}. Please provide a valid date-time.`);
    }

    const hospitalRecord = new HospitalRecord({
      appointments: [
        {
          date: appointmentDateTime,
          // Format time as HH:mm using date-fns
          time: format(appointmentDateTime, 'HH:mm'),
          status: appointmentInfo.status || 'Scheduled',
        },
      ],
      patient_type: patientType,
    });
    await hospitalRecord.save({ session });

    const bioData = new BioData({
      ...bioDataInfo,
    });
    await bioData.save({ session });

    hospitalRecord.biodata = bioData._id;
    await hospitalRecord.save({ session });

    const patient = new Patient({
      biodata: bioData._id,
      hospital_record: hospitalRecord._id,
    });

    await patient.save({ session });

    await session.commitTransaction();
    session.endSession();

    const patientData = await HospitalRecord.findById(hospitalRecord._id)
      .populate('biodata')
      .orFail()
      .exec();

    return { hospitalRecord: patientData };
  } catch (error) {
    console.error("Error in registerPatient:", error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = registerPatient;
