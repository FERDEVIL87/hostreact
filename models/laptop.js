const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Laptop = sequelize.define('Laptop', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'laptops',
  timestamps: true, // Sequelize akan mengelola timestamps
  createdAt: 'created_at', // Peta ke kolom 'created_at' di DB
  updatedAt: 'updated_at'  // Peta ke kolom 'updated_at' di DB
});

module.exports = Laptop;