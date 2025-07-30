const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/').get(protect, isAdmin, checkoutController.getCheckouts);
router.route('/:transaction_id').delete(protect, isAdmin, checkoutController.destroyCheckout);
router.route('/:transaction_id/status').patch(protect, isAdmin, checkoutController.updateStatus);

module.exports = router;