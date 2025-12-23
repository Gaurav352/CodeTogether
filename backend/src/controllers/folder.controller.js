import File from "../models/file.model.js";
import Folder from "../models/folder.model.js";
import Room from "../models/room.model.js";
export const createFolder=async(req,res)=>{
    try {
        const {name,parent,roomId}=req.body;

        if(!name || !roomId){
            return res.status(401).json({
                message:"Please provide all fields!",
                success:false
            })
        }
        const folder=new Folder({
            name,
            owner:req.user._id,
            roomId,
            parent
        })
        await folder.save();
        if(parent!==null){
            await Folder.updateOne({_id:parent},{$push:{subfolders:folder._id}});
        }
        await Room.updateOne({_id:roomId},{$push:{folders:folder._id}});
        
        return res.status(200).json({
            message:"Folder created",
            success:true,
            folder
        })

    } catch (error) {
        console.log("Error in folder creation ",error);
    }
}
export const deleteFolder=async(req,res)=>{
    try {
        const {folderId,roomId}=req.body;
        if(!folderId){
            return res.status(400).json({
                message:"No folderid found",
                success:false
            })
        }
        await File.deleteMany({folder:folderId});
        await Room.updateOne({_id:roomId},{$pull:{folders:folderId}});
        await Folder.deleteOne({_id:folderId});
        return res.status(200).json({
            message:"Folder deleted",
            success:true
        })
    } catch (error) {
        console.log("Error in folder creation ",error);
    }
}
export const getFileTree = async (req, res) => {
    try {
        const { roomId } = req.params;
        if(!roomId)return res.status(400).json({message:"Room not found",success:false});
        const folders = await Folder.find({ roomId }).lean();
        const files = await File.find({ room:roomId }).lean();
        return res.json({ folders, files,message:"Fetched data successfully",success:true });
    } catch (error) {
        return res.status(500).json({message:"Internal server error",success:false});
    }
};

export const createFile=async(req,res)=>{
    try {
        const {name,folder,roomId,language}=req.body;
        if(!name || !roomId ){
            return res.status(400).json({message:"Something is missing",success:false});
        }
        const file=await File.create({
            name,
            language,
            folder,
            room:roomId
        })
        await file.save();
        console.log("here");
        return res.status(201).json({message:"File created",success:true,file});
    } catch (error) {
        console.log("Error in file creation controller ",error);
        return res.status(500).json({message:"Internal server error",success:false});
    }
}
export const fetchFileContent=async(req,res)=>{
    try {
        const fileId=req.params.fileId;
        if(!fileId)return res.status(404).json({
            message:"file id not found",
            success:false
        })
        const file=await File.findById(fileId);
        return res.status(200).json({
            success:true,
            file
        })
    } catch (error) {
        console.log("error in file fetching controller ",error);
        return res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}
export const saveCode=async(req,res)=>{
    try {
        const fileId=req.params.fileId;
        const {content}=req.body;
        if(!fileId)return res.status(404).json({
            message:"File is missing",
            success:false,
        })  
        const file = await File.findByIdAndUpdate({_id:fileId},{content:content},{new:true});
        return res.status(200).json({
            file,
            success:true
        })
    } catch (error) {
        console.log("error in saving file ",error);
        return res.status(500).json({message:"Internal server error",success:false});
    }
}