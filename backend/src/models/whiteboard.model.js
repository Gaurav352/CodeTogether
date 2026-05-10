import mongoose from "mongoose";
const whiteboardSchema=new mongoose.Schema({
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
        required:true,
        unique:true,
    },
    elements: {
      type: Array, 
      default: []
    },
    appState: {
      type: Object, 
      default: {}
    }

},{timestamps:true});
const Whiteboard=mongoose.model("Whiteboard",whiteboardSchema);
export default Whiteboard;