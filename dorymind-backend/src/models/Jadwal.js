const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Jadwal = sequelize.define('Jadwal', {
  jadwalId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  hari: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mataKuliah: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jamKuliah: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ruang: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isNotified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

// Relasi 1:1 ke User
Jadwal.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  unique: true // Pastikan hanya satu jadwal per user
});

User.hasOne(Jadwal, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

module.exports = Jadwal;
