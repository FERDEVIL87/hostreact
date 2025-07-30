const Banner = require('../models/banner');
const { Op } = require('sequelize');
const { createSortLink, getBaseUrl } = require('./adminHelper');

const resource = 'banners';
const resourceName = 'Banner';
const searchFields = ['brand', 'name'];

// =================================================================================
// || METODE UNTUK API (MENGEMBALIKAN JSON)                                        ||
// =================================================================================

exports.getAllBannersAPI = async (req, res) => {
    try {
        // Ambil hanya banner yang aktif untuk ditampilkan di frontend
        const banners = await Banner.findAll({
            where: { is_active: true },
            order: [['order_column', 'ASC']]
        });
        res.json({ data: banners });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =================================================================================
// || METODE UNTUK ADMIN DASHBOARD (RENDER EJS & PROSES FORM)                       ||
// =================================================================================

exports.renderListPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const { search = '', sort = 'order_column', dir = 'asc' } = req.query;
        const whereClause = search ? { [Op.or]: searchFields.map(field => ({ [field]: { [Op.like]: `%${search}%` } })) } : {};
        const { count, rows } = await Banner.findAndCountAll({ where: whereClause, order: [[sort, dir]], offset: (page - 1) * limit, limit });
        res.render(`admin/${resource}/index`, { title: `Manajemen ${resourceName}`, items: rows, total: count, totalPages: Math.ceil(count / limit), currentPage: page, search, sort, dir, currentUrl: getBaseUrl(req), createSortLink: (label, column) => createSortLink(getBaseUrl(req), sort, dir, label, column), resource, resourceName, success: req.flash('success'), error: req.flash('error') });
    } catch (error) { res.status(500).send(error.message); }
};

exports.renderCreatePage = (req, res) => {
    res.render(`admin/${resource}/create`, { title: `Tambah ${resourceName}`, item: {}, resource, resourceName, errors: req.flash('errors'), oldInput: req.flash('oldInput')[0] || {} });
};

exports.handleCreateForm = async (req, res) => {
    try {
        const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.imageSrc;
        if (!imagePath) throw new Error('Sumber gambar (Upload atau URL) wajib diisi.');
        const features = req.body.features.split('\n').map(f => f.trim()).filter(f => f);
        const isActive = req.body.is_active === 'on';
        await Banner.create({ ...req.body, imageSrc: imagePath, features, is_active: isActive });
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
        const item = await Banner.findByPk(req.params.id);
        if (!item) { 
            req.flash('error', `${resourceName} tidak ditemukan.`); 
            return res.redirect(`/admin/${resource}`); 
        }
        res.render(`admin/${resource}/edit`, { 
            title: `Edit ${resourceName}`, 
            item, 
            resource, 
            resourceName, 
            errors: req.flash('errors'),
            oldInput: req.flash('oldInput')[0] || {} // <-- TAMBAHKAN INI
        });
    } catch (error) { res.status(500).send(error.message); }
};

exports.handleUpdateForm = async (req, res) => {
    try {
        const item = await Banner.findByPk(req.params.id);
        if (!item) { req.flash('error', `${resourceName} tidak ditemukan.`); return res.redirect(`/admin/${resource}`); }
        let updateData = { ...req.body };
        const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.imageSrc;
        if (imagePath) updateData.imageSrc = imagePath; else delete updateData.imageSrc;
        updateData.features = req.body.features.split('\n').map(f => f.trim()).filter(f => f);
        updateData.is_active = req.body.is_active === 'on';
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
        const item = await Banner.findByPk(req.params.id);
        if (item) await item.destroy();
        req.flash('success', `${resourceName} berhasil dihapus.`);
        res.redirect(`/admin/${resource}`);
    } catch (error) {
        req.flash('error', `Gagal menghapus: ${error.message}`);
        res.redirect(`/admin/${resource}`);
    }
};