// import express from 'express';
// import dotenv from 'dotenv';
// import { upload } from './multer.middleware.js';
// import { uploadOnCloudinary } from './cloundinary.js';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// // Get the directory name of the current module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public')); // Serve static files

// // Home route
// app.get('/home', (req, res) => {
//     res.sendFile(join(__dirname, 'public', 'homepage.html'));
// });

// // Create upload endpoint
// app.post('/upload', upload.single('file'), async (req, res) => {
//     try {
//         // Check if file exists
//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No file uploaded"
//             });
//         }

//         // Get the local path of uploaded file
//         const localFilePath = req.file.path;

//         // Upload to cloudinary
//         const result = await uploadOnCloudinary(localFilePath);

//         // Check if upload was successful
//         if (!result) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to upload file to Cloudinary"
//             });
//         }

//         // Send success response
//         res.status(200).json({
//             success: true,
//             message: "File uploaded successfully",
//             data: {
//                 file_url: result.url,
//                 public_id: result.public_id
//             }
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message
//         });
//     }
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         success: false,
//         message: "Something broke!",
//         error: err.message
//     });
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });






import express from 'express';
import dotenv from 'dotenv';
import { upload } from './multer.middleware.js';
import { uploadOnCloudinary } from './cloudinaryyy.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configure dotenv before anything else
dotenv.config();

// Validate environment variables
const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Missing required environment variable: ${varName}`);
        process.exit(1);
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home route
app.get('/home', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'homepage.html'));
});

// Upload route with better error handling
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        console.log("File received:", req.file);
        const localFilePath = req.file.path;
        console.log("Local file path:", localFilePath);

        const result = await uploadOnCloudinary(localFilePath);

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload file to Cloudinary"
            });
        }

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                file_url: result.url,
                public_id: result.public_id
            }
        });

    } catch (error) {
        console.error("Error in upload route:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Something went wrong!",
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the upload page at http://localhost:${PORT}/home`);
});