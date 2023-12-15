const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  fileUrl: {
    type: String,
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

module.exports = mongoose.model("url", urlSchema);
