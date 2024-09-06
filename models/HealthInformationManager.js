const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const healthInformationManagerSchema = new mongoose.Schema({
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
    superadmin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
    })


    healthInformationManagerSchema.pre("save", async function (next) {
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
          { studentId: this._id, matricNumber: this.matricNumber },
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
      


const HealthInformationManager = mongoose.model('HealthInformationManager', healthInformationManagerSchema);

module.exports = HealthInformationManager;