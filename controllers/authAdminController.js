const User = require('../models/user');

// RENDER HALAMAN LOGIN
exports.renderLoginPage = (req, res) => {
    // Jika user sudah login, arahkan ke dashboard
    if (req.session.user) {
        return res.redirect('/admin/users');
    }
    res.render('admin/login', {
        title: 'Admin Login',
        error: req.flash('error')
    });
};

// PROSES LOGIN
exports.handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 1. Cari user berdasarkan username
        const user = await User.findOne({ where: { username } });

        // 2. Cek apakah user ada, password cocok, DAN rolenya 'admin'
        if (user && await user.validPassword(password) && user.role === 'admin') {
            // 3. Simpan informasi user ke session
            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            };
            // Arahkan ke halaman yang tadinya ingin diakses atau ke dashboard
            const redirectUrl = req.session.returnTo || '/admin/users';
            delete req.session.returnTo;
            res.redirect(redirectUrl);
        } else {
            // Jika gagal, kirim pesan error kembali ke halaman login
            req.flash('error', 'Kredensial salah atau Anda bukan admin.');
            res.redirect('/admin/login');
        }
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan di server.');
        res.redirect('/admin/login');
    }
};

// PROSES LOGOUT
exports.handleLogout = (req, res) => {
    // Hancurkan session
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/admin/users'); // Jika gagal logout, tetap di dashboard
        }
        res.clearCookie('connect.sid'); // Hapus cookie session
        res.redirect('/admin/login'); // Arahkan ke halaman login
    });
};