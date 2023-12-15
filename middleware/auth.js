const jwt = require("jsonwebtoken");
const Users = require("../models/users");

const Authenticate =  async (req, res, next) => {
    try{

    const authHeader = req.headers["authorization"];
    //Extracting token from authorization header
    const token = authHeader && authHeader.split(" ")[1];
  

//   const token = req.header["Authorization"];
//   const token = req.header("Authorization");
  console.log("token >>>>  ", token);
  const { userId } = jwt.verify(token, "2ih8y93jdb8y!EDWD2#jihajx73$5%(83990");

//   console.log(userId);
 await Users.findOne({'email':userId})
    .then((user) => {
      console.log("user   >>  ",user);
      req.user = user;
      //   console.log("req.user >   ", req.user);
      next();
    })
    
  }catch(err){
    console.log('error in authentication ',err);
    res.status(401).json({ success: false , messege: 'authentication failed'});
  }
};

module.exports = {
  Authenticate,
};
