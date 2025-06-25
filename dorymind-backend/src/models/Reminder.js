const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Reminder = sequelize.define('Reminder', {
  reminderId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  mataKuliah: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tugas: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  reminderTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  attachmentLink: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent'),
    allowNull: false,
    defaultValue: 'pending'
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

// Relasi 1:1 dengan User
Reminder.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
User.hasOne(Reminder, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

module.exports = Reminder;
