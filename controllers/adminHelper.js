/**
 * Membuat link HTML untuk sorting kolom tabel.
 * @param {URL} currentUrl - Objek URL dari request saat ini.
 * @param {string} currentSort - Kolom yang sedang disortir.
 * @param {string} currentDir - Arah sorting saat ini ('asc' atau 'desc').
 * @param {string} label - Teks yang akan ditampilkan sebagai link (misal: "Nama").
 * @param {string} column - Nama kolom di database yang akan disortir (misal: "name").
 * @returns {string} - String HTML untuk tag <a>.
 */
exports.createSortLink = (currentUrl, currentSort, currentDir, label, column) => {
    // Tentukan arah sorting baru. Jika kolom sama dan arahnya 'asc', ubah ke 'desc', selain itu 'asc'.
    const newDir = (currentSort === column && currentDir === 'asc') ? 'desc' : 'asc';
    
    let icon = '';
    // Tambahkan ikon panah jika ini adalah kolom yang sedang aktif disortir.
    if (currentSort === column) {
        icon = currentDir === 'asc' ? '↑' : '↓';
    }
    
    // Buat salinan URL agar tidak mengubah objek URL asli.
    const url = new URL(currentUrl);
    // Set parameter 'sort' dan 'dir' di URL untuk link baru.
    url.searchParams.set('sort', column);
    url.searchParams.set('dir', newDir);
    
    // Kembalikan string HTML lengkap.
    return `<a href="${url.href}" style="color:#58a6ff; text-decoration:none;">${label} ${icon}</a>`;
};

/**
 * Mendapatkan URL dasar dari request, tanpa parameter 'page'.
 * Berguna untuk membangun link pagination dan sorting.
 * @param {object} req - Objek request dari Express.
 * @returns {URL} - Objek URL yang sudah dibersihkan.
 */
exports.getBaseUrl = (req) => {
    // Bangun URL lengkap dari request (protokol, host, dan path).
    const fullUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    // Hapus parameter 'page' agar link pagination tidak menumpuk parameter (contoh: ?page=1&page=2).
    fullUrl.searchParams.delete('page');
    return fullUrl;
};

/**
 * Memformat angka menjadi format mata uang Rupiah (Rp).
 * @param {number} number - Angka yang akan diformat.
 * @returns {string} - String dalam format Rupiah (misal: "Rp 1.500.000").
 */
exports.formatRupiah = (number) => {
    // Handle jika input bukan angka atau null.
    if (number === null || isNaN(number)) return "Rp 0";
    
    // Gunakan Intl.NumberFormat bawaan JavaScript untuk format mata uang yang benar.
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0 // Tidak menampilkan desimal.
    }).format(number);
};