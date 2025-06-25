const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Masukkan data user dari token ke request object
    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    // Tangani error karena token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, silakan login kembali" });
    }

    return res.status(401).json({ message: "Token tidak valid" });
  }
};

module.exports = auth;
