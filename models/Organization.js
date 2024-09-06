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
      required: true,
    },
  },
  { timestamps: true }
);

organizationSchema.pre("save", async function (next) {
    if (!this.organization_id) {
		const latestRecord = await this.constructor
			.findOne()
			.sort('-organization_id');
		const lastId = latestRecord
			? parseInt(latestRecord.organization_id.slice(3))
			: 0;
		this.organization_id = `CLG${(lastId + 1).toString().padStart(6, '0')}`;
	}
	next();
})


const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;