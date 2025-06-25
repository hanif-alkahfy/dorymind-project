const moment = require("moment-timezone");

// Simpan waktu server mulai berjalan
const serverStartTime = moment().tz("Asia/Jakarta");

// Fungsi untuk menghitung server up time
const getServerUpTime = () => {
  const duration = moment.duration(moment().diff(serverStartTime));
  return `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
};

// Fungsi untuk mencetak log dengan format tetap
const logWithTimestamp = (message, reset = false) => {
  const currentTimestamp = moment().tz("Asia/Jakarta").format("DD/MM/YY HH:mm");

  if (reset) {
    console.clear(); // Hapus semua log di terminal
    console.log(`[${currentTimestamp}] : Server Up Time: ${getServerUpTime()}`);
    console.log(""); // Tambah baris kosong
  }

  console.log(`[${currentTimestamp}] : ${message}`);
};

// Fungsi untuk update Server Up Time setiap 1 detik
const startServerUpTimeDisplay = () => {
  setInterval(() => {
    const currentTimestamp = moment().tz("Asia/Jakarta").format("DD/MM/YY HH:mm");
    console.log(`[${currentTimestamp}] : Server Up Time: ${getServerUpTime()}`);
  }, 1000);
};

module.exports = { logWithTimestamp, startServerUpTimeDisplay };
