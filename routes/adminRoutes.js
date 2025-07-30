const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// Import middleware proteksi
const { isAdminLoggedIn } = require('../middleware/authAdminMiddleware');

// Import semua controller
const authAdminController = require('../controllers/authAdminController');
const bannerController = require('../controllers/bannerController');
const checkoutController = require('../controllers/checkoutController');
const consoleController = require('../controllers/consoleController');
const customerServiceController = require('../controllers/customerServiceController');
const laptopController = require('../controllers/laptopController');
const pcPartController = require('../controllers/pcPartController');
const pcRakitanController = require('../controllers/pcRakitanController');
const techNewsController = require('../controllers/techNewsController');
const userController = require('../controllers/userController');

// ==========================================================
// || RUTE AUTENTIKASI (PUBLIK)                            ||
// ==========================================================
router.get('/login', authAdminController.renderLoginPage);
router.post('/login', authAdminController.handleLogin);
router.get('/logout', authAdminController.handleLogout); // Gunakan GET untuk logout yang mudah via link

// ==========================================================
// || SEMUA RUTE DI BAWAH INI SEKARANG TERPROTEKSI         ||
// ==========================================================
router.use(isAdminLoggedIn);

// --- Dashboard / Users Routes ---
router.get('/users', userController.renderListPage);
router.get('/users/create', userController.renderCreatePage);
router.post('/users', userController.handleCreateForm);
router.get('/users/edit/:id', userController.renderEditPage);
router.put('/users/update/:id', userController.handleUpdateForm);
router.delete('/users/delete/:id', userController.handleDeleteForm);

// --- Banners Routes ---
router.get('/banners', bannerController.renderListPage);
router.get('/banners/create', bannerController.renderCreatePage);
router.post('/banners', upload.single('image_upload'), bannerController.handleCreateForm);
router.get('/banners/edit/:id', bannerController.renderEditPage);
router.put('/banners/update/:id', upload.single('image_upload'), bannerController.handleUpdateForm);
router.delete('/banners/delete/:id', bannerController.handleDeleteForm);

// --- Laptops Routes ---
router.get('/laptops', laptopController.renderListPage);
router.get('/laptops/create', laptopController.renderCreatePage);
router.post('/laptops', upload.single('image_upload'), laptopController.handleCreateForm);
router.get('/laptops/edit/:id', laptopController.renderEditPage);
router.put('/laptops/update/:id', upload.single('image_upload'), laptopController.handleUpdateForm);
router.delete('/laptops/delete/:id', laptopController.handleDeleteForm);

// --- PC Parts Routes ---
router.get('/pc-parts', pcPartController.renderListPage);
router.get('/pc-parts/create', pcPartController.renderCreatePage);
router.post('/pc-parts', upload.single('image_upload'), pcPartController.handleCreateForm);
router.get('/pc-parts/edit/:id', pcPartController.renderEditPage);
router.put('/pc-parts/update/:id', upload.single('image_upload'), pcPartController.handleUpdateForm);
router.delete('/pc-parts/delete/:id', pcPartController.handleDeleteForm);

// --- PC Rakitans Routes ---
router.get('/pc-rakitans', pcRakitanController.renderListPage);
router.get('/pc-rakitans/create', pcRakitanController.renderCreatePage);
router.post('/pc-rakitans', upload.single('image_upload'), pcRakitanController.handleCreateForm);
router.get('/pc-rakitans/edit/:id', pcRakitanController.renderEditPage);
router.put('/pc-rakitans/update/:id', upload.single('image_upload'), pcRakitanController.handleUpdateForm);
router.delete('/pc-rakitans/delete/:id', pcRakitanController.handleDeleteForm);

// --- Consoles & Handhelds Routes ---
router.get('/console-and-handhelds', consoleController.renderListPage);
router.get('/console-and-handhelds/create', consoleController.renderCreatePage);
router.post('/console-and-handhelds', upload.single('image_upload'), consoleController.handleCreateForm);
router.get('/console-and-handhelds/edit/:id', consoleController.renderEditPage);
router.put('/console-and-handhelds/update/:id', upload.single('image_upload'), consoleController.handleUpdateForm);
router.delete('/console-and-handhelds/delete/:id', consoleController.handleDeleteForm);

// --- Tech News Routes ---
router.get('/tech-news', techNewsController.renderListPage);
router.get('/tech-news/create', techNewsController.renderCreatePage);
router.post('/tech-news', upload.single('image_upload'), techNewsController.handleCreateForm);
router.get('/tech-news/edit/:id', techNewsController.renderEditPage);
router.put('/tech-news/update/:id', upload.single('image_upload'), techNewsController.handleUpdateForm);
router.delete('/tech-news/delete/:id', techNewsController.handleDeleteForm);

// --- Checkouts Routes ---
router.get('/checkouts', checkoutController.renderListPage);
router.patch('/checkouts/status/:transaction_id', checkoutController.handleUpdateStatusForm);
router.delete('/checkouts/delete/:transaction_id', checkoutController.handleDeleteForm);

// --- Customer Service Routes ---
router.get('/customer-service', customerServiceController.renderListPage);
router.delete('/customer-service/delete/:id', customerServiceController.handleDeleteForm);

module.exports = router;