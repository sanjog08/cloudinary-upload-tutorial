import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Debug Cloudinary configuration
console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✓ Found" : "✗ Missing",
    api_key: process.env.CLOUDINARY_API_KEY ? "✓ Found" : "✗ Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "✓ Found" : "✗ Missing",
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file buffer to Cloudinary
const uploadOnCloudinary = async (buffer, filename) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", public_id: filename },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(new Error("Cloudinary upload failed"));
                }
                console.log("File uploaded to Cloudinary:", result.url);
                resolve(result);
            }
        );
        // Write buffer to the upload stream
        uploadStream.end(buffer);
    });
};

export { uploadOnCloudinary };
