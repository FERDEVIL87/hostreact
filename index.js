require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const sequelize = require('./config/database');

// Import rute master
const apiRoutes = require('./routes/apiRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --- Konfigurasi Middleware ---

// ==========================================================
// ||     KONFIGURASI CORS YANG DIPERBARUI DI SINI          ||
// ==========================================================
// Daftar origin (URL frontend) yang diizinkan untuk mengakses backend ini
const allowedOrigins = [
    'http://localhost:5173', // Port untuk `npm run dev`
    'http://localhost:4173', // Port untuk `npm run preview`
    'https://fp-web-with-react.vercel.app/', // Nanti, tambahkan URL Vercel Anda di sini setelah deploy
    
];

// Opsi konfigurasi CORS yang dinamis
const corsOptions = {
  origin: function (origin, callback) {
    // Izinkan request jika origin ada di dalam daftar `allowedOrigins`,
    // atau jika request tidak memiliki origin (misalnya, dari Postman).
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Akses diblokir oleh kebijakan CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
};

// Gunakan middleware cors dengan opsi yang sudah dikonfigurasi
app.use(cors(corsOptions));
// ==========================================================


app.use(session({ secret: process.env.JWT_SECRET || 'ganti_dengan_kunci_rahasia_yang_sangat_aman', resave: false, saveUninitialized: true, cookie: { secure: process.env.NODE_ENV === 'production' } }));
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.errors = req.flash('errors');
    res.locals.currentPath = req.path;
    next();
});

// --- Koneksi Database ---
sequelize.authenticate()
  .then(() => console.log('Database connected successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// --- Definisi Rute ---
app.get('/', (req, res) => res.redirect('/admin/users'));
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// --- Menjalankan Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;