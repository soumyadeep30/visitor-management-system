import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    visitorName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    organization: { type: String, trim: true },
    personToMeet: { type: String, required: true, trim: true },
    purpose: { type: String, required: true, trim: true },
    visitDateTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Checked In", "Checked Out"],
      default: "Checked In"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Visitor", visitorSchema);
