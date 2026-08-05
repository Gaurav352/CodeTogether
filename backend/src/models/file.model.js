import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    yjsState: { type: Buffer, default: null },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        default: null
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    language: {
        type: String,
        required: true
    }
}, { timestamps: true });

const File = mongoose.model("File", fileSchema);
export default File;