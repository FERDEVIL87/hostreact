// backend/models/customerService.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CustomerService = sequelize.define('CustomerService', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  nama: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  pesan: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'customer_services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
module.exports = CustomerService;