// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"

// // Configuration
// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET 
// });


// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
//         // upload the file on cloudinary
//         const response = await cloudinary.uploader.upload
//         (localFilePath, {
//             resource_type: "auto"
//         })
//         // file has been uploaded successfull
//         console.log("file is uploaded on cloudinary", 
//             response.url
//         );
//         return response;
//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved fileas the upload operation got failed
//         return null;
//     }
// }


// export {uploadOnCloudinary}





import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✓ Found" : "✗ Missing",
    api_key: process.env.CLOUDINARY_API_KEY ? "✓ Found" : "✗ Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "✓ Found" : "✗ Missing"
});

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("No file path provided");
            return null;
        }
        
        // Debug: Log file existence
        console.log("Checking file at path:", localFilePath);
        console.log("File exists:", fs.existsSync(localFilePath));

        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.log("File not found at path:", localFilePath);
            return null;
        }

        // Debug: Log Cloudinary configuration
        console.log("Attempting upload with config:", {
            cloud_name: cloudinary.config().cloud_name ? "✓ Set" : "✗ Missing",
            api_key: cloudinary.config().api_key ? "✓ Set" : "✗ Missing",
            api_secret: cloudinary.config().api_secret ? "✓ Set" : "✗ Missing"
        });

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // file has been uploaded successfully
        console.log("File is uploaded on cloudinary:", response.url);
        
        // Remove the file from local storage
        fs.unlinkSync(localFilePath);
        
        return response;

    } catch (error) {
        console.error("Error details:", {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        // Remove the locally saved file as the upload operation got failed
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
        
        // console.error("Error in uploadOnCloudinary:", error);
        // // Remove the locally saved file as the upload operation got failed
        // if (localFilePath && fs.existsSync(localFilePath)) {
        //     fs.unlinkSync(localFilePath);
        // }
        // return null;
    }
}

export { uploadOnCloudinary }