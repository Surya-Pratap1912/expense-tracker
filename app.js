console.clear();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./routes/router');
const navigationRoutes = require('./routes/userRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cors(/*{
    origin:'http://127.0.0.1:5501',
    methods:['GET', 'PUT', 'DELETE','POST']
}*/))
app.use(express.static(path.join(__dirname,'public')));

// app.set('views', 'views');

 
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://cdnjs.cloudflare.com https://api.razorpay.com https://cdn.jsdelivr.net https://checkout.razorpay.com https://img.freepik.com 'unsafe-inline'; connect-src 'self' https://lumberjack-cx.razorpay.com"
  );
  next();
});


app.use(router);
app.use(navigationRoutes);

mongoose.connect(process.env.MONGO_CONNECT)
.then(result =>{
    console.log('yha se suru hai');
    app.listen(process.env.PORT||3000);
})
.catch(err =>{
  console.log(err);
})