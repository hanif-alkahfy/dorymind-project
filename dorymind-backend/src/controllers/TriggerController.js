const { sequelize } = require("../config/database");

const createReminderTrigger = async () => {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS reminder_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reminder_id INT NOT NULL,
        event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (reminder_id) REFERENCES reminders(reminderId) ON DELETE CASCADE
      )
    `);

    await sequelize.query(`DROP TRIGGER IF EXISTS after_insert_reminder`);

    await sequelize.query(`
      CREATE TRIGGER after_insert_reminder
      AFTER INSERT ON reminders
      FOR EACH ROW
      INSERT INTO reminder_events (reminder_id) VALUES (NEW.reminderId)
    `);

  } catch (error) {
    console.error("Gagal membuat trigger:", error);
  }
};

module.exports = { createReminderTrigger };
