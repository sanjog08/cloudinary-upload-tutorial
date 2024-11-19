// import multer from "multer"

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/temp")
//     },
//     filename: function (req, file, cb) {
//       // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       // cb(null, file.fieldname + '-' + uniqueSuffix)
//       cb(null, file.originalname)
//     }
//   })
  
// export const upload = multer({ 
//     storage,
// })



import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure temp directory exists
const tempDir = "./public/temp";
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images, videos, and documents
    if (file.mimetype.startsWith('image/') || 
        file.mimetype.startsWith('video/') || 
        file.mimetype.startsWith('application/')) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});