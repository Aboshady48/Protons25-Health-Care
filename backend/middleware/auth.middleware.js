const jwt = require("jsonwebtoken");

/**
 * Middleware: Verify JWT and attach user info to req.user
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
