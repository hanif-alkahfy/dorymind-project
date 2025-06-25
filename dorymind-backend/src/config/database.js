const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        timezone: "+07:00", // Perbaiki timezone ke format yang benar
    },
    timezone: "+07:00", // Gunakan timezone yang valid untuk Jakarta
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connected!");
    } catch (error) {
        console.error("ERROR: Gagal terhubung ke database!", error);
    }
};
testConnection();

module.exports = {sequelize};
