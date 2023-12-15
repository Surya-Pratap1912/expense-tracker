const AWS = require("aws-sdk");

const uploadtos3 = (fileName, strData) => {
  const BUCKET_NAME = "expansetrackingapp123";
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  // console.log('this is the user key and access keys >>>>>>>>>>>>>>>>>  ', IAM_USER_KEY,IAM_USER_SECRET);

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    // bucket : BUCKET_NAME
  });
  // to create a new bucket and upload in it
  // s3bucket.createBucket(() => {
  //   var params = {
  //     Bucket: BUCKET_NAME,
  //     Key: fileName,
  //     Body: strData,
  //   };
  //   s3bucket.upload(params, (err, s3response) => {
  //     if (err) cconsole.log("err in uploadtos3", err);
  //     else console.log("done with uploadto s3 ", s3response);
  //   });
  // });

  // if bucket exists
  var params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: strData,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("err in uploadtos3", err);
        reject(err);
      } else {
        console.log("done with uploadto s3 ", s3response);
        resolve(s3response.Location);
      }
    });
  });
}


module.exports ={
    uploadtos3
}