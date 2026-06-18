const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    { id: user._id, usertype: user.usertype },
    process.env.JWT_SECRET || "development-secret",
    { expiresIn: "7d" }
  );
}

module.exports = generateToken;
