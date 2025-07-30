const multer = require('multer');
const path = require('path');

// Tentukan storage engine untuk menyimpan file
const storage = multer.diskStorage({
    destination: './uploads/', // Folder tujuan
    filename: function(req, file, cb) {
        // Buat nama file yang unik untuk menghindari konflik
        // Contoh: image_upload-171234567890.png
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Fungsi untuk memfilter hanya file gambar
function checkFileType(file, cb) {
    // Tipe file yang diizinkan
    const filetypes = /jpeg|jpg|png|gif|webp/;
    // Cek ekstensi file
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Cek tipe MIME
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); // Terima file
    } else {
        cb(new Error('Error: Hanya file gambar (jpeg, jpg, png, gif, webp) yang diizinkan!')); // Tolak file
    }
}

// Inisialisasi instance multer dengan konfigurasi di atas
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Batas ukuran file 10MB
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Ekspor instance multer yang sudah dikonfigurasi
module.exports = upload;