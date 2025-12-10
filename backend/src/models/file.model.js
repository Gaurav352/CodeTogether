import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: String,
  content: String,
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    required: true
  },
  typeOfFile:{
    type:String,
    required:true
  }
});
const File = mongoose.model("File",fileSchema);
export default File;
