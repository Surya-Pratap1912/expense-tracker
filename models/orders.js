 const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    paymentId : {
        type: String,
      
    },
    orderId : {
        type: String,
        required : true
    },
    status : {
        type: String,
        required : true
    },
   
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

module.exports = mongoose.model("orders", orderSchema);
