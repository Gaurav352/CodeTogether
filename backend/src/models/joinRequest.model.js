import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  message: { 
    type: String, 
    default: ""
  }
}, { timestamps: true });

joinRequestSchema.index({ senderId: 1, roomId: 1 }, { unique: true });
const JoinRequest = mongoose.model("JoinRequest", joinRequestSchema);
export default JoinRequest;