const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const superAdminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
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
    email: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    staff_id: {
        type: String,
        required: true,
    },
 })

superAdminSchema.pre('save', async function(next) {
    this.staff_id = `CEO${(lastId + 1).toString().padStart(6, '0')}`;
    next();
})

superAdminSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    if (this.isModified("securityAnswer")) {
      const salt = await bcrypt.genSalt(10);
      this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt);
    }
    next();
  });
  
  superAdminSchema.pre("findOneAndUpdate", async function (next) {
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
  
  superAdminSchema.methods.createJWT = function () {
    return jwt.sign(
      { staff_id: this.staff_id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    );
  };
  
  superAdminSchema.methods.comparePassword = async function (
    password
  ) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  };
  
  superAdminSchema.methods.compareSecurity = async function (
    securityAnswer
  ) {
    const isMatch = await bcrypt.compare(securityAnswer, this.securityAnswer);
    return isMatch;
  };

  const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

  module.exports = SuperAdmin;