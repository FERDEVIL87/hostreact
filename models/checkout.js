const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Checkout = sequelize.define('Checkout', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  transaction_id: { type: DataTypes.STRING, allowNull: false },
  product_name: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unit_price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  total_price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  customer_name: { type: DataTypes.STRING, allowNull: false },
  customer_address: { type: DataTypes.TEXT, allowNull: false },
  customer_phone: { type: DataTypes.STRING(20), allowNull: false },
  purchase_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status_order: { type: DataTypes.ENUM('Belum Dikonfirmasi', 'Sudah Dikonfirmasi', 'Sudah Dikirim', 'Selesai', 'Dibatalkan'), defaultValue: 'Belum Dikonfirmasi' },
}, { tableName: 'checkouts', timestamps: false }); // Laravel mengisi purchase_date, jadi kita matikan timestamps Sequelize

module.exports = Checkout;