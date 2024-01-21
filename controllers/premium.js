const User = require("../models/users");

exports.showLead = (req, res, next) => {
  if (req.user.isPremium) {
    User.find({}).select("userName totalExpanse").lean().exec()
    .then(( users) => {
      console.log('users', users);
     users.sort((a, b) => b.totalExpanse - a.totalExpanse);
      res.json(users);
    })
    .catch(err =>{
      console.error("Error fetching users:", err);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    })
  } else {
    res.json({ success: false, message: "Not a premium user" });
  }
};
