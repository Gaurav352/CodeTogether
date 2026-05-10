import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CHANGED: Accept 'originalName' as a second parameter
export const uploadToCloudinary = (buffer, originalName = "file") => {
  return new Promise((resolve, reject) => {
    
    // We sanitize the name slightly to prevent Cloudinary errors with spaces
    const safeName = originalName.replace(/\s+/g, "_").split('.')[0]; 
    const extension = originalName.split('.').pop(); 

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "codesync_uploads",
        resource_type: "auto",
        public_id: `${safeName}_${Date.now()}`, 
        use_filename: true,
        format: extension 
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};