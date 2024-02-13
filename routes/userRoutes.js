const express = require("express");
const path = require("path");
const router = express.Router();

const signUp = require("../controllers/user_control/signUp");
const login = require("../controllers/user_control/login");
const forgetPass = require("../controllers/user_control/forgetPassword");

router.get("/", (req, res, next) => {
  res.redirect("/signup");
});

router.get("/signup", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "signUp.html"));
});

router.post("/users/signUp", signUp.signUp);

router.get("/login", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "login.html"));
});

router.post("/users/login", login.login);

router.get("/forget-password", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "forget-password.html"));
});

router.post("/password/forget-password", forgetPass.forgetPass);
router.get("/password/resetpassword/:uu_id", forgetPass.resetPass);
router.post("/password/resetpassword", forgetPass.changePass);

module.exports = router;
