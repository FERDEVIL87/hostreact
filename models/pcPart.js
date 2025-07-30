const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PcPart = sequelize.define('PcPart', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, defaultValue: 0 },
  brand: { type: DataTypes.STRING(100), allowNull: false },
  category: { type: DataTypes.STRING(100), allowNull: false },
  image: { type: DataTypes.TEXT, allowNull: true },
  specs: { type: DataTypes.JSON, allowNull: true },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'pc_parts', timestamps: false }); // Tidak ada timestamps di skema

module.exports = PcPart;