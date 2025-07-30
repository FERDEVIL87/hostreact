const TechNews = require('../models/techNews');
const { Op } = require('sequelize');
const { createSortLink, getBaseUrl } = require('./adminHelper');

const resource = 'tech-news';
const resourceName = 'Berita Teknologi';
const searchFields = ['title', 'source'];

// =================================================================================
// || API METHODS (JSON)                                                          ||
// =================================================================================
exports.getAllTechNewsAPI = async (req, res) => {
    try {
        const { search, sort = 'date', dir = 'desc', page = 1, limit = 10 } = req.query;
        const whereClause = search ? { [Op.or]: searchFields.map(field => ({ [field]: { [Op.like]: `%${search}%` } })) } : {};
        
        // Pastikan tidak ada kondisi `where` lain yang salah di sini
        const { count, rows } = await TechNews.findAndCountAll({ 
            where: whereClause, 
            order: [[sort, dir]], 
            offset: (parseInt(page) - 1) * parseInt(limit), 
            limit: parseInt(limit) 
        });

        res.json({ total: count, pages: Math.ceil(count / parseInt(limit)), currentPage: parseInt(page), data: rows });
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

// =================================================================================
// || ADMIN DASHBOARD METHODS (EJS)                                               ||
// =================================================================================
exports.renderListPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const { search = '', sort = 'date', dir = 'desc' } = req.query;
        const whereClause = search ? { [Op.or]: searchFields.map(field => ({ [field]: { [Op.like]: `%${search}%` } })) } : {};
        const { count, rows } = await TechNews.findAndCountAll({ where: whereClause, order: [[sort, dir]], offset: (page - 1) * limit, limit });
        res.render(`admin/${resource}/index`, { title: `Manajemen ${resourceName}`, items: rows, total: count, totalPages: Math.ceil(count / limit), currentPage: page, search, sort, dir, currentUrl: getBaseUrl(req), createSortLink: (label, column) => createSortLink(getBaseUrl(req), sort, dir, label, column), resource, resourceName, success: req.flash('success'), error: req.flash('error') });
    } catch (error) { res.status(500).send(error.message); }
};
exports.renderCreatePage = (req, res) => { res.render(`admin/${resource}/create`, { title: `Tambah ${resourceName}`, item: {}, resource, resourceName, errors: req.flash('errors'), oldInput: req.flash('oldInput')[0] || {} }); };
exports.handleCreateForm = async (req, res) => {
    try {
        const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
        if (!imagePath) throw new Error('Sumber gambar (Upload atau URL) wajib diisi.');
        await TechNews.create({ ...req.body, imageUrl: imagePath });
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
        const item = await TechNews.findByPk(req.params.id);
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
            oldInput: req.flash('oldInput')[0] || {} // <-- Ditambahkan
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
exports.handleUpdateForm = async (req, res) => {
    try {
        const item = await TechNews.findByPk(req.params.id);
        if (!item) { req.flash('error', `${resourceName} tidak ditemukan.`); return res.redirect(`/admin/${resource}`); }
        let updateData = { ...req.body };
        const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
        if (imagePath) updateData.imageUrl = imagePath; else delete updateData.imageUrl;
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
        const item = await TechNews.findByPk(req.params.id);
        if (item) await item.destroy();
        req.flash('success', `${resourceName} berhasil dihapus.`);
        res.redirect(`/admin/${resource}`);
    } catch (error) {
        req.flash('error', `Gagal menghapus: ${error.message}`);
        res.redirect(`/admin/${resource}`);
    }
};