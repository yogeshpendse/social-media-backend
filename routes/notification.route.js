const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
router.use(express.json());

const { Post } = require("../models/post.model");
const { Notification } = require("../models/notification.model");
const { createpostnotifs } = require("../functions/createpostnotifs");
const { authhandler } = require("../middleware/authhandler");
const { extend } = require("lodash");
const { User } = require("../models/user.model");

function somefunc(arr1, arr2) {
  const notifarray = [...arr1];
  const userarray = [...arr2];
  const newarray = userarray.map((x) => {
    const userid = x.userid.toString();
    const notifval = notifarray.map((y) => {
      return y.targetedby.toString() === userid
        ? { success: true, ...y._doc, name: x.name, username: x.username }
        : { success: false };
    });
    const lo = notifval.filter((x) => x.success);
    return lo[0];
  });
  return newarray;
}

router.use(authhandler);
router.route("/notification").get(async (req, res) => {
  try {
    const uservalueid = req.uservalueid;
    const notifs = await Notification.find({ targetedat: uservalueid });
    const op = [...notifs].map((x) => x.targetedby.toString());
    const records = await User.find().where("userid").in(op).exec();
    const po = somefunc(notifs, records);
    res.json({
      success: true,
      finalrecs: po,
      //   records,
      //   notifs,
      //   notifsno: notifs[0],
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, errormessage: error.message, error });
  }
});

module.exports = router;
