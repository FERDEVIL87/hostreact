const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
        msg: 'Username ini sudah digunakan.' // Pesan error custom
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
        msg: 'Email ini sudah terdaftar.' // Pesan error custom
    },
    validate: {
      isEmail: {
        msg: 'Harap masukkan format email yang valid.' // Pesan error custom
      },
    },
  },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user', allowNull: false },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  }
});

User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;