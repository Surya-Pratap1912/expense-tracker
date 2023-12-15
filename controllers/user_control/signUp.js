const User = require("../../models/users");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res, nex) => {
  try {
    console.log(req.body);
    const { name: userName, mail: id, password } = req.body;

    const usr = await User.findOne({ email: id });
    // console.log('usr',usr);

    if (usr) {
      res
        .status(200 )
        .json({ message: "user already exists, please try logging in" });
    } else {
      //encrypting the passwords

      await bcrypt.hash(password, 10 /* salt */, (err, hash) => {
        if (err) {
          console.log(err);
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
          console.log("saved ", usr);
          res
            .status(201)
            .json({ message: "signed up successfully, go to login" });
        });
      });
    }
  }  catch (err) {
    console.log("err in signup", err);
    res.status(500).json({ message: " internal error" });
  }
};
