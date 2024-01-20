const Expanse = require("../models/expanse");
const User = require("../models/users");

const dwnContent = require("../models/downloadedFiles");
// const users = require('../models/users');
const S3Services = require("../services/s3services");
const mongoose = require('mongoose');
const { startSession } = require('mongoose');


const expanse = require("../models/expanse");

exports.downloadExpanseAsPdf = async (req, res) => {
   
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
    
      const pdfBuffer = await page.pdf();
      await browser.close();

      res.contentType('application/pdf');
      res.send(pdfBuffer);
  } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Internal Server Error');
  }

  }

exports.downloadExpanse = async (req, res, next) => {
  try {
    const expanses = await Expanse.find({'userId':req.user._id})
    // console.log('exps ', expanses);
  
    const strData = JSON.stringify(expanses);
    const fileName = `Expanse_${req.user.userName}/${new Date()}.txt`;
    console.log(fileName);
    const fileUrl = await S3Services.uploadtos3(fileName, strData);

    await dwnContent.create({
      fileUrl: fileUrl,
      userId: req.user
    });

    res.status(200).json({ fileUrl, success: true });
    console.log("expanses ", expanses);
  } catch (err) {
    console.log("err in catch downolaexpanse ", err);
    res.status(500).json({ fileUrl: "", success: false });
  }
  // res.json('a ra h');
};
exports.addExpanse = async function (req, res, next) {
  const session = await startSession();

  console.log('in addexpanse ');
  session.startTransaction();

  try {
    const { amt, des, cat } = req.body;

    req.user.totalExpanse = req.user.totalExpanse + +amt;
    await req.user.save();

    const createExpanse = new Expanse({
      amt: amt,
      des: des,
      cat: cat,
      userId: req.user._id,
    });

    await createExpanse.save();

   

    const obj = {
      amt,
      des,
      cat,
    };
    res.json(obj);
  } catch (err) {
    console.log("error in catch: ", err);

    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getExpanse = async (req, res, next) => {
  try{
  console.log('in getExpanse of expanse.js');
  console.log("user in req is     >>  ",req.user);
  const { email , userName, isPremium, totalExpanse } = req.user;
await expanse.find({'userId': req.user._id})
.then(async (exp) => {
  if(!exp) exp= [];
  let urls = await dwnContent.find({'userId':req.user._id});
  if(urls){
      if (urls.length > 5) {
        urls = urls.slice(-5);
      }
    }
    else{
      urls = [];
    }
      console.log("urls ",urls);
      console.log("exp  ",exp);


      if (req.user.isPremium)
        res.json({exp, userName, isPremium, totalExpanse, urls });
      else {
        const arr = exp.length > 10 ? exp.subarray(-10) : exp;
        res.json({ arr, userName, isPremium, totalExpanse });
      }
    })
    
  }catch(err){
    console.log('err in getexpanse ',err);
    res.send("<h1>error while getting response from the server</h1>");
  }
};

exports.deleteExpanse = async (req, res, next) => {
  const prodId = req.params.prodId;
  console.log(req.params.prodId);
  Expanse.findById(prodId)
    .then(async (exp) => {
      console.log("destroyed data");
      User.findById(req.user._id)
      .then(async (user) => {
        // console.log("user >>  ", user);
        user.totalExpanse= user.totalExpanse - +exp.amt; 
        await user.save();
      }
        );
        await Expanse.findByIdAndDelete(prodId);
      res.send("deleted successfully");
    })
    .catch((err) => {
      console.log(err);
    });
  // res.send(`<h1>delete....</h1>`);
};

exports.updateExpanse = async (req, res, next) => {
  const ExpanseId = req.params.prodId;
  const { amt, des, cat } = req.body;
  Expanse.findById(ExpanseId)
    .then(async (data) => {
      const change = +amt - +data.amt;
      User.findById(data.userId)
      .then(async (user) => {
        user.totalExpanse= user.totalExpanse + +change 
      }
        );
    
      data.amt = amt;
      data.des = des;
      data.cat = cat;

      return data.save();
    })
    .then(async () => {
      res.send("updated successfully");
    })
    .catch((err) => {
      console.log(err);
    
    });
};
