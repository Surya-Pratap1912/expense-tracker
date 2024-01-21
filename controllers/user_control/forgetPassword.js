// const express = require('express');

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
   // console.log("in forget-password");
  const { mail } = req.body;
   // console.log(mail);
  const uu_id = uuidv4();
  try {
    const user = await User.findOne({'email': mail});
     // console.log("user found ", user);
    // making request true for user
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
      })
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

       // console.log("uu_id in forg pass ", uu_id);
      transEmailApi
        .sendTransacEmail({
          sender,
          to: receiver,
          subject: "password reset for getexpanses",
          textContent: `hey there, here is the password reset link for your getexpanse account  http:// 54.226.18.204:10000/password/resetpassword/${uu_id}`,
        })
        .then((result) => {
           // console.log('email info ',result)
          res.json({
            success: true,
            message:
              "a mail with reset link has been sent to your registered mail id",
          }); 
        })
        .catch(err =>{
           // console.log('err in sending mail ', err)
        });

      
    }
  } catch (err) {
     // console.log("error in try-catch forg pass  ", err);
    res.status(500).json(err);
  }
};

exports.resetPass = async (req, res, next) => {
   // console.log("................at....... 1..........");
  
  const {params, query , body } = req;
   // console.log("params     ",params);
   // console.log("query     ",query);
   // console.log("body     ",body);
  const uu_id = req.params.uu_id;
  try {
     // console.log("uu_id   ", uu_id);
     // console.log("................at....... 2..........");
    const uuid = await Fpr.findOne({'uuid':uu_id});
     // console.log("................at....... 3..........",uuid);
     // console.log("uuid  active  ", uuid.isactive);
    if (uuid && uuid.isactive) {
       // console.log("................at....... 4..........");
      res.sendFile(
        path.join(
          __dirname,
          "..",
          "..",
          "views",
          "reset_password.html"
        )
      );
    } else {
      res.status(404).send("<h1>page not found</h1>");
    }
    // res.send('<h1>a gya </h1>');
     // console.log("................at....... 5..........");
  } catch (err) {
     // console.log("................at....... 6..........");
     // console.log("error in catch of reset passs", err);
  }
};

exports.changePass = async (req, res, next) => {
   // console.log("................at....... 7..........");
   // console.log("body in change pass ", req.body);
  const { uu_id, password } = req.body;
  try {
    const uuid = await Fpr.findOne({'uuid': uu_id});
    if (!uuid.isactive) {
      res.status(404).send("<h1>page not found</h1>");
    } else {
      //  // console.log("uuid.userId , uuid.isactive", uuid.userId, uuid.isactive);
      //update pass
      const user = await User.findOne(uuid.userId);
       // console.log('user ',user);
      bcrypt.hash(password, 10 /* salt */, async (err, hash) => {
        if(err)
         // console.log("err in bcrypt ", err);
        
        user.password = hash;
        await user.save();

        uuid.isactive = false;
        await uuid.save();
      });
      res
        .status(201)
        .json({ message: "password changed successfully, go to login" });

      // res.json('<h1>a gya </h1>');
    }
  } catch (err) {
     // console.log("error in   catch of change password");
    res.status(500).json({ message: "server error" });
  }
};
