const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const healthInformationManagerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
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
    superadmin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SuperAdmin',
        required: true,
    },
    password: {
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
    registeredBy: {
      type: String,
      required: true,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    sentPatients: [{
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HospitalRecord',
        },
        sentTo: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
    }],
    })


    healthInformationManagerSchema.pre("save", async function (next) {
        if (this.isModified("password") && this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        if (this.isModified("securityAnswer") && this.securityAnswer) {
            const salt = await bcrypt.genSalt(10);
            this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt);
        }
        next();
      });
      
      healthInformationManagerSchema.pre("findOneAndUpdate", async function (next) {
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
      
      healthInformationManagerSchema.methods.createJWT = function () {
        return jwt.sign(
          { staff_id: this.staff_id },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_LIFETIME,
          }
        );
      };
      
      healthInformationManagerSchema.methods.comparePassword = async function (password) {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
      };
      
      healthInformationManagerSchema.methods.compareSecurity = async function (securityAnswer) {
        const isMatch = await bcrypt.compare(securityAnswer, this.securityAnswer);
        return isMatch;
      };
      
      healthInformationManagerSchema.methods.generateStaffId = async function() {
        if (!this.staff_id) {
          const latestRecord = await this.constructor.findOne().sort('-staff_id');
          const lastId = latestRecord ? parseInt(latestRecord.staff_id.slice(3)) : 0;
          this.staff_id = `HIM${(lastId + 1).toString().padStart(6, '0')}`;
        }
      };

const HealthInformationManager = mongoose.model('HealthInformationManager', healthInformationManagerSchema);

module.exports = HealthInformationManager;