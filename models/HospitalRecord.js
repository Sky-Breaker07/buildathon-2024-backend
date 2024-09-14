const mongoose = require("mongoose");

const hospitalRecordSchema = new mongoose.Schema({
  hospital_id: {
    type: String,
    trim: true,
    unique: true,
    default: null,
  },

  biodata: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BioData",
    default: null,
  },
  patient_type: {
    type: String,
    enum: ["In-Patient", "Out-Patient"],
    required: false
  },
  appointments: [
    {
      date: {
        type: Date,
        required: true,
        default: Date.now(),
      },
      time:{
        type: String,
        default: "8:00AM"
      },
      status: {
        type: String,
        enum: ["Scheduled", "Cancelled", "Completed", "Missed"],
        default: "Scheduled",
      },
    },
  ],

  professionals_assigned: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthCareProfessional",
      default: null,
    },
  ],
  sessionCount: {
    type: Number,
    default: null,
  },
  nightCount: {
    type: Number,
    default: null,
  },
  mortality: {
    status: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: null,
    },
    cause: {
      type: String,
      default: null,
    },
  },
});

// Add indexes
hospitalRecordSchema.index({ hospital_id: 1 }, { unique: true });
hospitalRecordSchema.index({ patient_id: 1 });

hospitalRecordSchema.pre("save", async function (next) {
  if (!this.hospital_id) {
    const latestRecord = await this.constructor.findOne().sort("-hospital_id");
    const lastId = latestRecord
      ? parseInt(latestRecord.hospital_id.slice(3))
      : 0;
    this.hospital_id = `HOS${(lastId + 1).toString().padStart(6, "0")}`;
  }
  next();
});

const HospitalRecord = mongoose.model("HospitalRecord", hospitalRecordSchema);

module.exports = HospitalRecord;
