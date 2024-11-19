import dotenv from 'dotenv';
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

console.log('\n--- Testing Cloudinary Configuration ---\n');

// Check if environment variables are set
console.log('Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Found' : '✗ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓ Found' : '✗ Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓ Found' : '✗ Missing');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test configuration
const config = cloudinary.config();
console.log('\nCloudinary Configuration:');
console.log('cloud_name:', config.cloud_name ? '✓ Set' : '✗ Missing');
console.log('api_key:', config.api_key ? '✓ Set' : '✗ Missing');
console.log('api_secret:', config.api_secret ? '✓ Set' : '✗ Missing');