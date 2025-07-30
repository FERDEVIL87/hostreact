const ConsoleAndHandheld = require('../models/consoleAndHandheld');
const { Op } = require('sequelize');
const { createSortLink, getBaseUrl, formatRupiah } = require('./adminHelper');

const resource = 'console-and-handhelds';
const resourceName = 'Console & Handheld';
const searchFields = ['name', 'brand', 'category'];
const categories = ["Console", "Handheld", "Accessories"];

// =================================================================================
// || API METHODS (JSON)                                                          ||
// =================================================================================
exports.getAllConsolesAPI = async (req, res) => {
    try {
        const { search, sort = 'name', dir = 'asc', page = 1, limit = 10 } = req.query;
        const whereClause = search ? { [Op.or]: searchFields.map(field => ({ [field]: { [Op.like]: `%${search}%` } })) } : {};
        const { count, rows } = await ConsoleAndHandheld.findAndCountAll({ where: whereClause, order: [[sort, dir]], offset: (page - 1) * limit, limit });
        res.json({ total: count, pages: Math.ceil(count / limit), currentPage: parseInt(page), data: rows });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// =================================================================================
// || ADMIN DASHBOARD METHODS (EJS)                                               ||
// =================================================================================
exports.renderListPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const { search = '', sort = 'name', dir = 'asc' } = req.query;
        const whereClause = search ? { [Op.or]: searchFields.map(field => ({ [field]: { [Op.like]: `%${search}%` } })) } : {};
        const { count, rows } = await ConsoleAndHandheld.findAndCountAll({ where: whereClause, order: [[sort, dir]], offset: (page - 1) * limit, limit });
        res.render(`admin/${resource}/index`, { title: `Manajemen ${resourceName}`, items: rows, total: count, totalPages: Math.ceil(count / limit), currentPage: page, search, sort, dir, currentUrl: getBaseUrl(req), createSortLink: (label, column) => createSortLink(getBaseUrl(req), sort, dir, label, column), formatRupiah, resource, resourceName, success: req.flash('success'), error: req.flash('error') });
    } catch (error) { res.status(500).send(error.message); }
};
exports.renderCreatePage = (req, res) => { res.render(`admin/${resource}/create`, { title: `Tambah ${resourceName}`, item: {}, categories, resource, resourceName, errors: req.flash('errors'), oldInput: req.flash('oldInput')[0] || {} }); };
exports.handleCreateForm = async (req, res) => {
    try {
        const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image;
        if (!imagePath) throw new Error('Sumber gambar (Upload atau URL) wajib diisi.');
        const specs = req.body.specs ? req.body.specs.split('\n').map(s => s.trim()).filter(s => s) : [];
        await ConsoleAndHandheld.create({ ...req.body, image: imagePath, specs });
        req.flash('success', `${resourceName} berhasil ditambahkan.`);
        res.redirect(`/admin/${resource}`);
    } catch (error) {
        req.flash('errors', [error.message]);
        req.flash('oldInput', req.body);
        res.redirect(`/admin/${resource}/create`);
    }
};
exports.renderEditPage = async (req, res) => {
    try {
        const item = await ConsoleAndHandheld.findByPk(req.params.id);
        if (!item) {
            req.flash('error', `${resourceName} tidak ditemukan.`);
            return res.redirect(`/admin/${resource}`);
        }
        res.render(`admin/${resource}/edit`, {
            title: `Edit ${resourceName}`,
            item,
            categories,
            resource,
            resourceName,
            errors: req.flash('errors'),
            oldInput: req.flash('oldInput')[0] || {} // <-- Ditambahkan
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
exports.handleUpdateForm = async (req, res) => {
    try {
        const item = await ConsoleAndHandheld.findByPk(req.params.id);
        if (!item) { req.flash('error', `${resourceName} tidak ditemukan.`); return res.redirect(`/admin/${resource}`); }
        let updateData = { ...req.body };
        const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image;
        if (imagePath) updateData.image = imagePath; else delete updateData.image;
        updateData.specs = req.body.specs ? req.body.specs.split('\n').map(s => s.trim()).filter(s => s) : [];
        await item.update(updateData);
        req.flash('success', `${resourceName} berhasil diperbarui.`);
        res.redirect(`/admin/${resource}`);
    } catch (error) {
        req.flash('errors', [error.message]);
        res.redirect(`/admin/${resource}/edit/${req.params.id}`);
    }
};
exports.handleDeleteForm = async (req, res) => {
    try {
        const item = await ConsoleAndHandheld.findByPk(req.params.id);
        if (item) await item.destroy();
        req.flash('success', `${resourceName} berhasil dihapus.`);
        res.redirect(`/admin/${resource}`);
    } catch (error) {
        req.flash('error', `Gagal menghapus: ${error.message}`);
        res.redirect(`/admin/${resource}`);
    }
};