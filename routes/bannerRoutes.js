// F:\BE\backend\routes\bannerRoutes.js
const express = require('express');
const router = express.Router();
const { getBanners, createBanner /*, ... */ } = require('../controllers/bannerController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Rute publik
router.get('/', getBanners);

// Rute admin
router.post('/', protect, isAdmin, upload, createBanner);
// router.put('/:id', protect, isAdmin, upload, updateBanner);
// router.delete('/:id', protect, isAdmin, deleteBanner);

module.exports = router;