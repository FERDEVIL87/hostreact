const User = require('../models/user');
const { Op } = require('sequelize');
const { createSortLink, getBaseUrl } = require('./adminHelper');

const resource = 'users';
const resourceName = 'User';
const searchFields = ['username', 'email', 'role'];

// METODE UNTUK ADMIN DASHBOARD
exports.renderListPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const { search = '', sort = 'id', dir = 'asc' } = req.query;
        const whereClause = search ? { [Op.or]: searchFields.map(field => ({ [field]: { [Op.like]: `%${search}%` } })) } : {};
        const { count, rows } = await User.findAndCountAll({ where: whereClause, order: [[sort, dir]], offset: (page - 1) * limit, limit, attributes: { exclude: ['password'] } });
        res.render(`admin/users/index`, { title: `Manajemen ${resourceName}`, items: rows, total: count, totalPages: Math.ceil(count / limit), currentPage: page, search, sort, dir, currentUrl: getBaseUrl(req), createSortLink: (label, column) => createSortLink(getBaseUrl(req), sort, dir, label, column), resource, resourceName, loggedInUserId: req.user ? req.user.id : null, success: req.flash('success'), error: req.flash('error') });
    } catch (error) { res.status(500).send(error.message); }
};
exports.renderCreatePage = (req, res) => { res.render(`admin/users/create`, { title: `Tambah ${resourceName}`, item: {}, resource, resourceName, errors: req.flash('errors'), oldInput: req.flash('oldInput')[0] || {} }); };
exports.handleCreateForm = async (req, res) => {
    const { username, email, password, password_confirmation, role } = req.body;
    if (password !== password_confirmation) {
        req.flash('errors', [{ message: 'Password dan konfirmasi password tidak cocok.' }]);
        req.flash('oldInput', req.body);
        return res.redirect(`/admin/users/create`);
    }
    try {
        await User.create({ username, email, password, role });
        req.flash('success', `${resourceName} berhasil ditambahkan.`);
        res.redirect(`/admin/users`);
    } catch (error) {
        req.flash('errors', error.errors || [{ message: error.message }]);
        req.flash('oldInput', req.body);
        res.redirect(`/admin/users/create`);
    }
};
exports.renderEditPage = async (req, res) => {
    try {
        const item = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
        if (!item) {
            req.flash('error', `${resourceName} tidak ditemukan.`);
            return res.redirect(`/admin/${resource}`);
        }
        res.render(`admin/users/edit`, {
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
        const item = await User.findByPk(req.params.id);
        if (!item) { req.flash('error', `${resourceName} tidak ditemukan.`); return res.redirect(`/admin/users`); }
        const { username, email, role, password, password_confirmation } = req.body;
        if (password) {
            if (password !== password_confirmation) {
                req.flash('errors', [{ message: 'Password dan konfirmasi password tidak cocok.' }]);
                return res.redirect(`/admin/users/edit/${req.params.id}`);
            }
            item.password = password;
        }
        item.username = username; item.email = email; item.role = role;
        await item.save();
        req.flash('success', `${resourceName} berhasil diperbarui.`);
        res.redirect(`/admin/users`);
    } catch (error) {
        req.flash('errors', error.errors || [{ message: error.message }]);
        res.redirect(`/admin/users/edit/${req.params.id}`);
    }
};
exports.handleDeleteForm = async (req, res) => {
    try {
        if (req.user && req.user.id === parseInt(req.params.id)) {
            req.flash('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
            return res.redirect(`/admin/users`);
        }
        const item = await User.findByPk(req.params.id);
        if (item) await item.destroy();
        req.flash('success', `${resourceName} berhasil dihapus.`);
        res.redirect(`/admin/users`);
    } catch (error) {
        req.flash('error', `Gagal menghapus: ${error.message}`);
        res.redirect(`/admin/users`);
    }
};