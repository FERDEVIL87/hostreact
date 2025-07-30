const CustomerService = require('../models/customerService');
const { Op } = require('sequelize');
const { createSortLink, getBaseUrl } = require('./adminHelper');

const resource = 'customer-service';
const resourceName = 'Pesan Customer';

// METODE UNTUK API
exports.createMessageAPI = async (req, res) => {
    try {
        const { nama, email, pesan } = req.body;
        const message = await CustomerService.create({ nama, email, pesan });
        res.status(201).json({ message: 'Pesan berhasil dikirim!', data: message });
    } catch (error) { res.status(400).json({ message: `Gagal mengirim pesan: ${error.message}` }); }
};

// METODE UNTUK ADMIN DASHBOARD
exports.renderListPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const { search = '', sort = 'created_at', dir = 'desc' } = req.query; // Menggunakan created_at
        const whereClause = search ? { [Op.or]: [{ nama: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }, { pesan: { [Op.like]: `%${search}%` } }] } : {};
        const { count, rows } = await CustomerService.findAndCountAll({ where: whereClause, order: [[sort, dir]], offset: (page - 1) * limit, limit });
        res.render(`admin/customer-service/index`, { title: resourceName, items: rows, total: count, totalPages: Math.ceil(count / limit), currentPage: page, search, sort, dir, currentUrl: getBaseUrl(req), createSortLink: (label, column) => createSortLink(getBaseUrl(req), sort, dir, label, column), resource, resourceName, success: req.flash('success'), error: req.flash('error') });
    } catch (error) { res.status(500).send(error.message); }
};
exports.handleDeleteForm = async (req, res) => {
    try {
        const item = await CustomerService.findByPk(req.params.id);
        if (item) { await item.destroy(); req.flash('success', 'Pesan berhasil dihapus.'); } 
        else { req.flash('error', 'Pesan tidak ditemukan.'); }
        res.redirect(`/admin/customer-service`);
    } catch (error) {
        req.flash('error', `Gagal menghapus pesan: ${error.message}`);
        res.redirect(`/admin/customer-service`);
    }
};