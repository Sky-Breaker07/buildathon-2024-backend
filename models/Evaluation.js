const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluationTemplate",
      required: true,
    },

    hospital_record: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalRecord",
      required: true,
    },

    evaluation_data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

// Add indexes
evaluationSchema.index({ template: 1 });
evaluationSchema.index({ hospital_record: 1 });
evaluationSchema.index({ createdAt: -1 });

const Evaluation = mongoose.model("Evaluation", evaluationSchema);

module.exports = Evaluation;
