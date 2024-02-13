const User = require("../../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateAccessToken(id /* ispremiumuser */) {
  return jwt.sign(
    { userId: id /* ispremiumuser */ },
    /*secret code  */ "2ih8y93jdb8y!EDWD2#jihajx73$5%(83990"
  );
}

exports.login = (req, res, nex) => {
  try {
    const { mail, password } = req.body;
    User.findOne({ email: mail }).then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            res
              .status(500)
              .json({ success: false, message: "something went wrong" });
          } else {
            if (result) {
              user.loggedIn = true;
              user.save();
              res.status(200).json({
                success: true,
                user: user.userName,
                message: `${user.userName} logged in successfully`,
                token: generateAccessToken(mail),
              });
            } else {
              res
                .status(200)
                .json({ success: false, message: "password is incorrect" });
            }
          }
        });
      } else {
        res.status(200).send("user doesn't exist, please sign up");
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};
