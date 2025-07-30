const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PcRakitan = sequelize.define('PcRakitan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  specs: {
    type: DataTypes.JSON,
    allowNull: false
  },
}, {
  tableName: 'pc_rakitans',
  timestamps: true, // Sequelize akan mengelola timestamps
  createdAt: 'created_at', // Peta ke kolom 'created_at' di DB
  updatedAt: 'updated_at'  // Peta ke kolom 'updated_at' di DB
});

module.exports = PcRakitan;