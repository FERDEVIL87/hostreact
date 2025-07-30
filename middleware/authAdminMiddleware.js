exports.isAdminLoggedIn = (req, res, next) => {
    // Cek apakah ada data user di session DAN rolenya adalah 'admin'
    if (req.session.user && req.session.user.role === 'admin') {
        // Jika ya, lanjutkan ke request berikutnya
        return next();
    }
    
    // Jika tidak, simpan URL yang ingin diakses
    req.session.returnTo = req.originalUrl;
    
    // Arahkan ke halaman login
    req.flash('error', 'Anda harus login sebagai admin untuk mengakses halaman ini.');
    res.redirect('/admin/login');
};