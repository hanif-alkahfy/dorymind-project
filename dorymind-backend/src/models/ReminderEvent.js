const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database");

const ReminderEvent = sequelize.define(
  "ReminderEvent",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reminder_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "reminders",
        key: "reminderId",
      },
      onDelete: "CASCADE",
    },
    event_time: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "reminder_events",
    timestamps: false,
  }
);

module.exports = ReminderEvent;
