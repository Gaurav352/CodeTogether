import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        default: null
    },
    subfolders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder"
    }],
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    }],
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        default: null
    },
}, { timestamps: true });

const Folder = mongoose.model("Folder", folderSchema);
export default Folder;