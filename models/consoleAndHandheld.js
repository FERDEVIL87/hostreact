// backend/models/consoleAndHandheld.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ConsoleAndHandheld = sequelize.define('ConsoleAndHandheld', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  brand: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  specs: { type: DataTypes.JSON, allowNull: true },
  stock: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'console_and_handhelds',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
module.exports = ConsoleAndHandheld;