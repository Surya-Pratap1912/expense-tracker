const path = require("path");
const User = require("../../models/users");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const Fpr = require("../../models/forg-pass-requests");

// forget pass

client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SIB_API;

exports.forgetPass = async (req, res, next) => {
  const { mail } = req.body;
  const uu_id = uuidv4();
  try {
    const user = await User.findOne({ email: mail });
    if (!user) {
      res.json({
        success: false,
        message: "user doesn't exist please sign up",
      });
    } else {
      const req = new Fpr({
        uuid: uu_id,
        isactive: true,
        userId: user,
      });
      await req.save();

      const transEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: "chauhanaman1912@gmail.com",
        name: "suryansh chauhan",
      };

      const receiver = [
        {
          email: mail,
        },
      ];

      transEmailApi
        .sendTransacEmail({
          sender,
          to: receiver,
          subject: "password reset for getexpanses",
          textContent: `hey there, here is the password reset link for your getexpanse account  http://54.226.18.204:11000/password/resetpassword/${uu_id}`,
        })
        .then((result) => {
          res.json({
            success: true,
            message:
              "a mail with reset link has been sent to your registered mail id",
          });
        })
        .catch((err) => {});
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.resetPass = async (req, res, next) => {
  const { params, query, body } = req;
  const uu_id = req.params.uu_id;
  try {
    const uuid = await Fpr.findOne({ uuid: uu_id });
    if (uuid && uuid.isactive) {
      res.sendFile(
        path.join(__dirname, "..", "..", "views", "reset_password.html")
      );
    } else {
      res.status(404).send("<h1>page not found</h1>");
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.changePass = async (req, res, next) => {
  const { uu_id, password } = req.body;
  try {
    const uuid = await Fpr.findOne({ uuid: uu_id });
    if (!uuid.isactive) {
      res.status(404).send("<h1>page not found</h1>");
    } else {
      const user = await User.findOne(uuid.userId);
      bcrypt.hash(password, 10 /* salt */, async (err, hash) => {
        if (err) user.password = hash;
        await user.save();

        uuid.isactive = false;
        await uuid.save();
      });
      res
        .status(201)
        .json({ message: "password changed successfully, go to login" });
    }
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};
