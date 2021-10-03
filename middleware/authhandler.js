const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User } = require("../models/user.model");
async function authhandler(req, res, next) {
  try {
    const token = req.headers.authorization;
    const decode = jwt.verify(token, "secret");
    const userval = decode.username;
    const userdatavalue = await User.findOne({ username: userval });
    // console.log(userdatavalue);
    req.usernamefromtoken = decode.username;
    req.docid = userdatavalue._id;
    req.uservalueid = userdatavalue.userid;
    req.userval = userdatavalue;
    req.userfollowing = userdatavalue.following;
    req.userfollowers = userdatavalue.followers;
    req.likedposts = userdatavalue.likedposts;
    next();
  } catch (error) {
    console.error({ errormessage: error.message });
    res.status(401).json({ success: false, errormessage: error.message });
  }
}
module.exports = { authhandler };
