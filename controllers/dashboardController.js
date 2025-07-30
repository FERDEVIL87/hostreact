const User = require('../../models/user');
const { Op } = require('sequelize');
const { createSortLink, getBaseUrl } = require('../adminHelper');
const bcrypt = require('bcryptjs');

const resource = 'users';
const resourceName = 'User';

// RENDER LIST PAGE (Dashboard Utama)
exports.renderList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const { search = '', sort = 'id', dir = 'asc' } = req.query;

        const whereClause = search ? { [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { role: { [Op.like]: `%${search}%` } }
        ]} : {};

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            order: [[sort, dir]],
            offset: (page - 1) * limit,
            limit: limit,
            attributes: { exclude: ['password'] }
        });

        res.render('admin/users/index', {
            title: 'Manajemen User',
            items: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            search, sort, dir,
            currentUrl: getBaseUrl(req),
            createSortLink: (label, column) => createSortLink(getBaseUrl(req), sort, dir, label, column),
            resource, resourceName,
            loggedInUserId: req.user ? req.user.id : null, // Kirim ID user yang login
            success: req.flash('success'), error: req.flash('error')
        });
    } catch (error) { res.status(500).send(error.message); }
};

// RENDER CREATE FORM
exports.renderCreateForm = (req, res) => {
    res.render(`admin/${resource}/create`, {
        title: `Tambah ${resourceName}`, item: {}, resource, resourceName, errors: req.flash('errors')
    });
};

// HANDLE CREATE
exports.handleCreate = async (req, res) => {
    const { username, email, password, password_confirmation, role } = req.body;
    if (password !== password_confirmation) {
        req.flash('errors', [{ message: 'Password dan konfirmasi password tidak cocok.' }]);
        return res.redirect(`/admin/${resource}/create`);
    }
    try {
        await User.create({ username, email, password, role });
        req.flash('success', `${resourceName} berhasil ditambahkan.`);
        res.redirect(`/admin/${resource}`);
    } catch (error) {
        req.flash('errors', error.errors || [{ message: error.message }]);
        res.redirect(`/admin/${resource}/create`);
    }
};

// RENDER EDIT FORM
exports.renderEditForm = async (req, res) => {
    try {
        const item = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
        if(!item) {
            req.flash('error', `${resourceName} tidak ditemukan.`);
            return res.redirect(`/admin/${resource}`);
        }
        res.render(`admin/${resource}/edit`, {
            title: `Edit ${resourceName}`, item, resource, resourceName, errors: req.flash('errors')
        });
    } catch (error) { res.status(500).send(error.message); }
};

// HANDLE UPDATE
exports.handleUpdate = async (req, res) => {
    try {
        const item = await User.findByPk(req.params.id);
        if(!item) {
             req.flash('error', `${resourceName} tidak ditemukan.`);
             return res.redirect(`/admin/${resource}`);
        }
        const { username, email, role, password, password_confirmation } = req.body;
        if (password) {
            if (password !== password_confirmation) {
                req.flash('errors', [{ message: 'Password dan konfirmasi password tidak cocok.' }]);
                return res.redirect(`/admin/${resource}/edit/${req.params.id}`);
            }
            item.password = password; // Hashing akan ditangani oleh hook di model
        }
        item.username = username;
        item.email = email;
        item.role = role;
        await item.save();
        req.flash('success', `${resourceName} berhasil diperbarui.`);
        res.redirect(`/admin/${resource}`);
    } catch (error) {
        req.flash('errors', error.errors || [{ message: error.message }]);
        res.redirect(`/admin/${resource}/edit/${req.params.id}`);
    }
};

// HANDLE DELETE
exports.handleDelete = async (req, res) => {
    try {
        // PENTING: Mencegah user menghapus dirinya sendiri
        if (req.user && req.user.id === parseInt(req.params.id)) {
            req.flash('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
            return res.redirect(`/admin/${resource}`);
        }
        const item = await User.findByPk(req.params.id);
        if (item) await item.destroy();
        req.flash('success', `${resourceName} berhasil dihapus.`);
        res.redirect(`/admin/${resource}`);
    } catch (error) {
        req.flash('error', `Gagal menghapus: ${error.message}`);
        res.redirect(`/admin/${resource}`);
    }
};