import multer from 'multer';
import path from 'path';

// Path penyimpanan untuk gambar
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// Path penyimpanan untuk video
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/videos/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// URL akses untuk file statis
const baseUrl = 'http://example.com/uploads/';

// Fungsi untuk memeriksa tipe file gambar
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

// Fungsi untuk memeriksa tipe file video
const videoFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only videos are allowed'));
    }
};

// Konfigurasi multer untuk gambar
const imageUpload = multer({
    storage: imageStorage,
    fileFilter: imageFileFilter
});

// Konfigurasi multer untuk video
const videoUpload = multer({
    storage: videoStorage,
    fileFilter: videoFileFilter
});

// Controller untuk upload gambar
function uploadImages(req, res) {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ status: 'error', message: 'No files uploaded' });
    }

    imageUpload.array('images')(req, res, err => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ status: 'error', message: err.message });
        } else if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        // Mengembalikan informasi tambahan
        const filenames = req.files.map(file => ({
            filename: file.filename,
            path: path.join('uploads/images', file.filename),
            url: baseUrl + 'images/' + file.filename
        }));
        res.status(200).json({ status: 'success', message: 'Images uploaded successfully', filenames });
    });
}

// Controller untuk upload video
function uploadVideos(req, res) {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ status: 'error', message: 'No files uploaded' });
    }

    videoUpload.array('videos')(req, res, err => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ status: 'error', message: err.message });
        } else if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        // Mengembalikan informasi tambahan
        const filenames = req.files.map(file => ({
            filename: file.filename,
            path: path.join('uploads/videos', file.filename),
            url: baseUrl + 'videos/' + file.filename
        }));
        res.status(200).json({ status: 'success', message: 'Videos uploaded successfully', filenames });
    });
}

export { uploadImages, uploadVideos };