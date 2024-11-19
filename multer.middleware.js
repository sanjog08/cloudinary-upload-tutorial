import multer from "multer";

// Use memory storage to handle files in serverless environments
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Accept images, videos, and documents
    if (
        file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/') ||
        file.mimetype.startsWith('application/')
    ) {
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
    },
});
