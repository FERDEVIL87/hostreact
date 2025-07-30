const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slogan: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageSrc: {
    type: DataTypes.STRING(2048),
    allowNull: false
  },
  features: {
    type: DataTypes.JSON,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  order_column: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'banners',
  timestamps: true, // Sequelize akan mengelola timestamps
  createdAt: 'created_at', // Peta ke kolom 'created_at' di DB
  updatedAt: 'updated_at'  // Peta ke kolom 'updated_at' di DB
});

module.exports = Banner;