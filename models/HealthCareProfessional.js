const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const healthCareProfessionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  staff_id: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  securityAnswer: {
    type: String,
    required: false,
  },
  securityQuestion: {
    type: String,
    required: false,
  },
  patientsAssigned: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalRecord",
    }
  ],
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  registeredBy: {
    type: String,
    required: true,
  },
});

healthCareProfessionalSchema.methods.generateStaffId = async function() {
  if (!this.staff_id) {
    const latestRecord = await this.constructor.findOne().sort('-staff_id');
    const lastId = latestRecord ? parseInt(latestRecord.staff_id.slice(3)) : 0;
    this.staff_id = `HCP${(lastId + 1).toString().padStart(6, '0')}`;
  }
};

healthCareProfessionalSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified('securityAnswer') && this.securityAnswer) {
    const salt = await bcrypt.genSalt(10);
    this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt);
  }
  next();
});

healthCareProfessionalSchema.pre('findOneAndUpdate', async function (next) {
  if (this.getUpdate().password) {
    const salt = await bcrypt.genSalt(10);
    this.getUpdate().password = await bcrypt.hash(
      this.getUpdate().password,
      salt
    );
  }
  if (this.getUpdate().securityAnswer) {
    const salt = await bcrypt.genSalt(10);
    this.getUpdate().securityAnswer = await bcrypt.hash(
      this.getUpdate().securityAnswer,
      salt
    );
  }
  next();
});

healthCareProfessionalSchema.methods.createJWT = function () {
  return jwt.sign(
    { studentId: this._id, matricNumber: this.matricNumber },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

healthCareProfessionalSchema.methods.comparePassword = async function (
  password
) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

healthCareProfessionalSchema.methods.compareSecurity = async function (
  securityAnswer
) {
  const isMatch = await bcrypt.compare(securityAnswer, this.securityAnswer);
  return isMatch;
};

const HealthCareProfessional = mongoose.model(
  'HealthCareProfessional',
  healthCareProfessionalSchema
);

module.exports = HealthCareProfessional;
