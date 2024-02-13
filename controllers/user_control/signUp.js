const User = require("../../models/users");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res, nex) => {
  try {
    const { name: userName, mail: id, password } = req.body;
    const usr = await User.findOne({ email: id });

    if (usr) {
      res
        .status(200)
        .json({ message: "user already exists, please try logging in" });
    } else {
      await bcrypt.hash(password, 10 /* salt */, (err, hash) => {
        if (err) {
          res.status(500).json({ message: " internal error", err });
        }

        const user = new User({
          email: id,
          userName: userName,
          password: hash,
          loggedIn: false,
          totalExpanse: 0,
          isPremium: false,
        });
        user.save().then((usr) => {
          res
            .status(201)
            .json({ message: "signed up successfully, go to login" });
        });
      });
    }
  } catch (err) {
    res.status(500).json({ message: " internal error" });
  }
};
