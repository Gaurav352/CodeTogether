import File from "../models/file.model";
import Folder from "../models/folder.model";
import Room from "../models/room.model";
export const create=async(req,res)=>{
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