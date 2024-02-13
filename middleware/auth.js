const jwt = require("jsonwebtoken");
const Users = require("../models/users");

const Authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    const { userId } = jwt.verify(
      token,
      "2ih8y93jdb8y!EDWD2#jihajx73$5%(83990"
    );

    await Users.findOne({ email: userId }).then((user) => {
      req.user = user;
      next();
    });
  } catch (err) {
    res.status(401).json({ success: false, messege: "authentication failed" });
  }
};

module.exports = {
  Authenticate,
};
