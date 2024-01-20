
const Razorpay = require("razorpay");
const Order = require("../models/orders"); 
const User = require("../models/users");

const purchasepremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 2500;

    rzp.orders.create({ amount: 2500, currency: "INR" }, async (err, order) => {
      if (err) {
        //console.log("purchase.js error 1 >>   ", err);
        throw new Error(JSON.stringify(err));
      }

      const newOrder = new Order({
        orderId: order.id,
        status: "pending",
        userId: req.user
      });

      await newOrder.save();

     

      return res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (err) {
    //console.log("purchase.js error 2 ", err);
    res.status(500).json({ message: "something went wrong in purchase.js", error: err });
  }
};

const updatetransectionstatus = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const { payment_id, order_id, status } = req.body;

    const order = await Order.findOne({ orderId: order_id });

    if (status === "failed") {
      await Promise.all([
        Order.findByIdAndUpdate(order._id, { paymentId: payment_id, status: "Failed" }),
        User.findByIdAndUpdate(userId, { isPremium: false }),
      ]);

      return res.status(400).json({ success: false, message: "transaction failed" });
    } else {
      await Promise.all([
        Order.findByIdAndUpdate(order._id, { paymentId: payment_id, status: status }),
        User.findByIdAndUpdate(userId, { isPremium: true }),
      ]);

      return res.status(202).json({
        success: true,
        message: "Transaction Successful",
      });
    }
  } catch (err) {
    //console.log("err in purchase update 2 ", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

 module.exports = {
    purchasePremium: purchasepremium,
    updatetransectionstatus: updatetransectionstatus,
  };
