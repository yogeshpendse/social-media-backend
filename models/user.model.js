const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, required: true },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  followers: [],
  following: [],
  likedposts: [],
});

const User = mongoose.model("Userdatalist", Userschema);

module.exports = { User };
