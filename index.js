// import express from 'express';
// import dotenv from 'dotenv';
// import { upload } from './multer.middleware.js';
// import { uploadOnCloudinary } from './cloudinaryyy.js';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import fs from 'fs';

// // Configure dotenv before anything else
// dotenv.config();

// // Validate required environment variables
// const requiredEnvVars = [
//     'CLOUDINARY_CLOUD_NAME',
//     'CLOUDINARY_API_KEY',
//     'CLOUDINARY_API_SECRET'
// ];

// requiredEnvVars.forEach((varName) => {
//     if (!process.env[varName]) {
//         console.error(`Missing required environment variable: ${varName}`);
//         process.exit(1);
//     }
// });

// // Resolve __dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Ensure public directory exists
// const publicDir = join(__dirname, 'public');
// if (!fs.existsSync(publicDir)) {
//     fs.mkdirSync(publicDir, { recursive: true });
// }

// // Serve static files
// app.use(express.static(publicDir));

// // Home route
// app.get('/', (req, res) => {
//     res.send('Hello, your server is running fine.....');
// });

// // Route to serve homepage
// app.get('/home', (req, res) => {
//     const filePath = join(publicDir, 'homepage.html');
//     fs.access(filePath, fs.constants.F_OK, (err) => {
//         if (err) {
//             console.error('File not found:', filePath);
//             return res.status(404).send('404: Homepage not found!');
//         }
//         res.sendFile(filePath);
//     });
// });

// // File upload route
// app.post('/upload', upload.single('file'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No file uploaded",
//             });
//         }

//         console.log("File received:", req.file);

//         const result = await uploadOnCloudinary(req.file.path);

//         if (!result) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to upload file to Cloudinary",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "File uploaded successfully",
//             data: {
//                 file_url: result.url,
//                 public_id: result.public_id,
//             },
//         });
//     } catch (error) {
//         console.error("Error in upload route:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message || "Internal server error",
//         });
//     }
// });

// // Error handling middleware for uncaught errors
// app.use((err, req, res, next) => {
//     console.error("Global error handler:", err);
//     res.status(500).json({
//         success: false,
//         message: err.message || "Something went wrong!",
//     });
// });

// // Set port and start the server
// const PORT = process.env.PORT || 3003;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//     console.log(`Access the upload page at http://localhost:${PORT}/home`);
// });






import express from 'express';
import dotenv from 'dotenv';
import { upload } from './multer.middleware.js';
import { uploadOnCloudinary } from './cloudinaryyy.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Configure dotenv before anything else
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`Missing required environment variable: ${varName}`);
        process.exit(1);
    }
});

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure public directory exists
const publicDir = join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Serve static files
app.use(express.static(publicDir));

// Home route
app.get('/', (req, res) => {
    res.send('Hello, your server is running fine.....');
});

// Route to serve homepage
app.get('/home', (req, res) => {
    const filePath = join(publicDir, 'homepage.html');
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File not found:', filePath);
            return res.status(404).send('404: Homepage not found!');
        }
        res.sendFile(filePath);
    });
});

// File upload route
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        console.log("File received:", req.file);

        // Upload file buffer to Cloudinary
        const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload file to Cloudinary",
            });
        }

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                file_url: result.url,
                public_id: result.public_id,
            },
        });
    } catch (error) {
        console.error("Error in upload route:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
});

// Error handling middleware for uncaught errors
app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Something went wrong!",
    });
});

// Set port and start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the upload page at http://localhost:${PORT}/home`);
});
