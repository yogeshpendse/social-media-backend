const mongoose = require("mongoose");
const Notificationschema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, required: true },
    postid: { type: String, required: true },
    type: { type: String, required: true },
    targetedat: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetedby: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);
const Notification = mongoose.model("Notificationdatalist", Notificationschema);
module.exports = { Notification };
