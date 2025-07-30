const express = require('express');
const router = express.Router();

// --- Import semua controller yang dibutuhkan oleh API ---
const authController = require('../controllers/authController');
const bannerController = require('../controllers/bannerController');
const checkoutController = require('../controllers/checkoutController');
const consoleController = require('../controllers/consoleController');
const customerServiceController = require('../controllers/customerServiceController');
const laptopController = require('../controllers/laptopController');
const pcPartController = require('../controllers/pcPartController');
const pcRakitanController = require('../controllers/pcRakitanController');
const techNewsController = require('../controllers/techNewsController');
const simulasiController = require('../controllers/simulasiController');


// ==========================================================
// || SUB-ROUTER UNTUK ENDPOINT /auth                      ||
// ==========================================================
// Ini memastikan rute Anda menjadi /api/auth/login dan /api/auth/register
const authRouter = express.Router();
authRouter.post('/login', authController.loginUser);
authRouter.post('/register', authController.registerUser);
// Anda bisa menambahkan rute /auth lainnya di sini nanti
// authRouter.get('/profile', protect, authController.getUserProfile);
router.use('/auth', authRouter);


// ==========================================================
// || RUTE PUBLIK LAINNYA                                  ||
// ==========================================================
router.post('/customer-service', customerServiceController.createMessageAPI);
router.post('/checkout', checkoutController.createCheckoutAPI);
router.post('/order-status', checkoutController.getOrderStatusAPI);


// ==========================================================
// || RUTE UNTUK MENGAMBIL DATA (GET)                      ||
// ==========================================================
router.get('/banners', bannerController.getAllBannersAPI);
router.get('/laptops', laptopController.getAllLaptopsAPI);
router.get('/pc-parts', pcPartController.getAllPcPartsAPI);
router.get('/pc-rakitans', pcRakitanController.getAllPcRakitansAPI);
router.get('/console-and-handhelds', consoleController.getAllConsolesAPI);
router.get('/tech-news', techNewsController.getAllTechNewsAPI);
router.get('/simulasi-parts', simulasiController.getPcPartsForSimulasi);

module.exports = router;