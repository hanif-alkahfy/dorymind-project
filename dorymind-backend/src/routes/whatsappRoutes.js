const express = require("express");
const {
  initDefault,
  sendDefaultMessage,
  initUserBot,
  sendUserMessage,
  resetUserBotSession
} = require("../controllers/whatsappController");

const auth = require("../middleware/auth");

const router = express.Router();

// 🔓 BOT DEFAULT (tidak perlu auth)
router.post("/init-default", initDefault);
router.post("/send-default", sendDefaultMessage);

// 🔐 BOT USER (pakai JWT)
router.post("/init-user", auth, initUserBot);
router.post("/send-user", auth, sendUserMessage);

// RESET BOT SESSION (pakai JWT)
router.post("/reset-session", auth, resetUserBotSession);

module.exports = router;
