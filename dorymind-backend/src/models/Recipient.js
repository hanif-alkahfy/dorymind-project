const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Recipient = sequelize.define('Recipient', {
  recipientId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('default', 'custom'),
    allowNull: false,
    defaultValue: 'default' // default: pakai bot default
  }
}, {
  timestamps: true
});

// Relasi 1 user = 1 nomor penerima
Recipient.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

User.hasOne(Recipient, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

module.exports = Recipient;
