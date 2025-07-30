const Checkout = require('../models/checkout');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const { getBaseUrl, formatRupiah, createSortLink } = require('./adminHelper');

const resource = 'checkouts';
const resourceName = 'Pesanan Masuk';

// =================================================================================
// || METODE UNTUK API (MENGEMBALIKAN JSON)                                        ||
// =================================================================================

exports.createCheckoutAPI = async (req, res) => {
    try {
        const { cart, customerDetails } = req.body;
        if (!cart || !Array.isArray(cart) || cart.length === 0) { return res.status(400).json({ message: 'Keranjang belanja tidak boleh kosong.' }); }
        if (!customerDetails || !customerDetails.name || !customerDetails.address || !customerDetails.phone) { return res.status(400).json({ message: 'Detail pelanggan tidak lengkap.' }); }
        const transaction_id = `JWR-${Date.now()}`;
        const checkoutItems = cart.map(item => ({
            transaction_id,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.quantity * item.price,
            customer_name: customerDetails.name,
            customer_address: customerDetails.address,
            customer_phone: customerDetails.phone,
            status_order: 'Belum Dikonfirmasi'
        }));
        await Checkout.bulkCreate(checkoutItems);
        res.status(201).json({ message: 'Checkout berhasil!', transaction_id });
    } catch (error) {
        console.error("Checkout API Error:", error);
        res.status(400).json({ message: 'Checkout gagal, terjadi kesalahan.', error: error.message });
    }
};

// **FUNGSI YANG HILANG - TAMBAHKAN INI**
exports.getOrderStatusAPI = async (req, res) => {
    try {
        const { customer_name } = req.body;
        if (!customer_name) {
            return res.status(400).json({ message: "Nama pelanggan wajib diisi." });
        }
        const orders = await Checkout.findAll({
            where: { customer_name: { [Op.like]: `%${customer_name}%` } },
            order: [['purchase_date', 'DESC']]
        });
        const groupedOrders = orders.reduce((acc, order) => {
            const key = order.transaction_id;
            if (!acc[key]) { acc[key] = []; }
            acc[key].push(order);
            return acc;
        }, {});
        res.json(groupedOrders);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil status pesanan.", error: error.message });
    }
};

// =================================================================================
// || METODE UNTUK ADMIN DASHBOARD (RENDER EJS & PROSES FORM)                       ||
// =================================================================================

exports.renderListPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const { search = '', sort = 'purchase_date', dir = 'desc' } = req.query;
        const whereClause = search ? { [Op.or]: [{ transaction_id: { [Op.like]: `%${search}%` } }, { customer_name: { [Op.like]: `%${search}%` } }] } : {};
        const uniqueTransactionIdsResult = await Checkout.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('transaction_id')), 'transaction_id'], 'purchase_date', 'customer_name'],
            where: whereClause,
            order: [[sort, dir]]
        });
        const total = uniqueTransactionIdsResult.length;
        const paginatedTransactionIds = uniqueTransactionIdsResult.slice((page - 1) * limit, page * limit).map(t => t.transaction_id);
        const allItems = paginatedTransactionIds.length > 0 ? await Checkout.findAll({ where: { transaction_id: { [Op.in]: paginatedTransactionIds } }, order: [[sort, dir]] }) : [];
        const groupedTransactions = allItems.reduce((acc, item) => {
            if (!acc[item.transaction_id]) { acc[item.transaction_id] = { ...item.toJSON(), items: [], grandTotal: 0 }; }
            acc[item.transaction_id].items.push(item);
            acc[item.transaction_id].grandTotal += parseFloat(item.total_price);
            return acc;
        }, {});
        const finalGroupedArray = paginatedTransactionIds.map(id => groupedTransactions[id]);
        res.render(`admin/${resource}/index`, { title: resourceName, groupedTransactions: finalGroupedArray, total, totalPages: Math.ceil(total / limit), currentPage: page, search, sort, dir, currentUrl: getBaseUrl(req), createSortLink: (label, column) => createSortLink(getBaseUrl(req), sort, dir, label, column), formatRupiah, resource, resourceName, success: req.flash('success'), error: req.flash('error') });
    } catch (error) { res.status(500).send(error.message); }
};

exports.handleUpdateStatusForm = async (req, res) => {
    try {
        const { transaction_id } = req.params;
        const { status } = req.body;
        await Checkout.update({ status_order: status }, { where: { transaction_id } });
        req.flash('success', `Status untuk transaksi ${transaction_id} berhasil diupdate.`);
    } catch (error) {
        req.flash('error', `Gagal update status: ${error.message}`);
    }
    res.redirect(`/admin/${resource}`);
};

exports.handleDeleteForm = async (req, res) => {
    try {
        const { transaction_id } = req.params;
        await Checkout.destroy({ where: { transaction_id } });
        req.flash('success', `Transaksi ${transaction_id} berhasil dihapus.`);
    } catch (error) {
        req.flash('error', `Gagal menghapus transaksi: ${error.message}`);
    }
    res.redirect(`/admin/${resource}`);
};