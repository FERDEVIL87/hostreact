exports.createSortLink = (currentUrl, currentSort, currentDir, label, column) => {
    const newDir = (currentSort === column && currentDir === 'asc') ? 'desc' : 'asc';
    let icon = '';
    if (currentSort === column) {
        icon = currentDir === 'asc' ? '↑' : '↓';
    }
    
    const url = new URL(currentUrl);
    url.searchParams.set('sort', column);
    url.searchParams.set('dir', newDir);
    
    return `<a href="${url.href}" style="color:#58a6ff; text-decoration:none;">${label} ${icon}</a>`;
};

exports.getBaseUrl = (req) => {
    const fullUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    fullUrl.searchParams.delete('page');
    return fullUrl;
};

exports.formatRupiah = (number) => {
    if (number === null || isNaN(number)) return "Rp 0";
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};