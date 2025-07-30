const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TechNews = sequelize.define('TechNews', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY, // Hanya menyimpan tanggal, tanpa waktu
    allowNull: false
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING(2048),
    allowNull: true
  },
  readMoreUrl: {
    type: DataTypes.STRING(2048),
    allowNull: true
  },
}, {
  tableName: 'tech_news',
  timestamps: true, // Sequelize akan mengelola timestamps
  createdAt: 'created_at', // Peta ke kolom 'created_at' di DB
  updatedAt: 'updated_at'  // Peta ke kolom 'updated_at' di DB
});

module.exports = TechNews;