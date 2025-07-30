const PcPart = require('../models/pcPart');
const { Op } = require('sequelize');

// Kategori yang akan ditampilkan di form simulasi
const simulasiCategories = [
    "PROCESSOR INTEL",
    "PROCESSOR AMD",
    "MAINBOARD",
    "MEMORY",
    "VGA",
    "SSD",
    "PSU",
    "CASE"
];

/**
 * @desc    Mengambil semua PC Parts yang relevan untuk simulasi, dikelompokkan per kategori.
 * @route   GET /api/simulasi-parts
 * @access  Public
 */
exports.getPcPartsForSimulasi = async (req, res) => {
    try {
        // Ambil semua parts yang kategorinya termasuk dalam daftar di atas
        const parts = await PcPart.findAll({
            where: {
                category: {
                    [Op.in]: simulasiCategories
                }
            },
            // Pilih hanya field yang dibutuhkan untuk mengurangi ukuran payload
            attributes: ['id', 'name', 'price', 'category'],
            order: [['category', 'ASC'], ['price', 'ASC']]
        });

        // Kelompokkan hasil berdasarkan kategori
        const groupedParts = parts.reduce((acc, part) => {
            const category = part.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(part);
            return acc;
        }, {});

        res.json(groupedParts);

    } catch (error) {
        console.error("Simulasi Parts API Error:", error);
        res.status(500).json({ message: 'Gagal memuat komponen untuk simulasi.' });
    }
};