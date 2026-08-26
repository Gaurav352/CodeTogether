
import mongoose from 'mongoose';
const inviteSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true, index: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  invitedEmail: { type: String, required: true, lowercase: true, trim: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REVOKED'], 
    default: 'PENDING' 
  },
  expiresAt: { type: Date, required: true,index:{expires:0} }
}, { timestamps: true });

export default mongoose.model('Invite', inviteSchema);