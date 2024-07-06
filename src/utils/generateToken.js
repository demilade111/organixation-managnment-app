const jwt = require("jsonwebtoken");


const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
module.exports = generateToken;