const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    organization_id: {
      type: String,
      unique: true,
    },
    superAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
    staff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HealthCareProfessional",
      },
    ],
    healthInformationManagers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HealthInformationManager",
      },
    ],
  },
  { timestamps: true }
);

organizationSchema.pre("validate", async function (next) {
  if (!this.organization_id) {
    try {
      const latestRecord = await this.constructor
        .findOne()
        .sort("-organization_id");
      const lastId = latestRecord
        ? parseInt(latestRecord.organization_id.slice(3))
        : 0;
      this.organization_id = `CLG${(lastId + 1).toString().padStart(6, "0")}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
