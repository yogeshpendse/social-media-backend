const express = require("express");
const mongoose = require("mongoose");
const { extend } = require("lodash");
const router = express.Router();
router.use(express.json());
const { User } = require("../models/user.model");
const { getarrayusers } = require("../functions/getarrayusers");
const { authhandler } = require("../middleware/authhandler");

router.route("/data").get(async (req, res) => {
  try {
    const userdata = await User.find();
    res.json({ success: true, route: "getdata", data: userdata });
  } catch (error) {
    res.json({
      success: false,
      route: "getdata",
      errormessage: error.message,
    });
  }
});

router.route("/check").get(async (req, res) => {
  try {
    const op = await User.find();
    const firstobj = op[1];
    const val = mongoose.Types.ObjectId.isValid(firstobj._id);
    console.log({ opp: typeof firstobj.userid });
    console.log(new Date(Date.now()));
    res.json({
      op,
      firstobj,
      val,
      opp: firstobj.userid,
      oo: typeof firstobj.userid,
    });
  } catch (error) {
    res.json({ success: false });
  }
});

router.use(authhandler);
router
  .route("/follow")
  .post(async (req, res) => {
    try {
      const { userid } = req.body;
      const objectId = mongoose.Types.ObjectId(userid);
      const userobjectId = req.uservalueid;
      if (userid === userobjectId.toString()) {
        return res
          .status(400)
          .json({ success: false, message: "can't follow yourself" });
      }
      // const followerId = mongoose.Types.ObjectId(follower);
      /*
      otheruser, you -----> status : ✔️
      check if your id exists -----> status : ✔️
      in their followers -----> status : ✔️
      and if it doesn't add -----> status : ✔️
      and their userid tp your -----> status : ❌
      following -----> status : ❌
      */
      const followerId = req.uservalueid;
      const userfollowing = req.userfollowing;
      const userdatavalue = req.userdatavalue;
      const docid = req.docid;
      const user = await User.find({ userid: objectId });
      const userobject = user[0];
      const ok = [...userobject.followers].map((x) => x.toString());
      const ko = [...ok].some((x) => x === followerId.toString());
      if (ko === false) {
        const newuserobject = extend(userobject, {
          followers: [...userobject.followers, followerId],
        });
        // following
        const newmydoc = extend(userdatavalue, {
          following: [...userfollowing, objectId],
        });

        // user: newuserobject;
        await User.findByIdAndUpdate(newuserobject._id, newuserobject);
        await User.findByIdAndUpdate(docid, newmydoc);
        res.json({ success: true, message: "following successful" });
      }
      if (ko === true) {
        res.status(400).json({ success: true, message: "already following" });
      }
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  })
  .get(async (req, res) => {
    try {
      const objectId = mongoose.Types.ObjectId("61223e6dfda2b635f4e107c2");
      const op = await User.find({ userid: objectId });
      const followers = [...op.followers];
      console.log(followers);
      res.json({ success: true, op });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  });
router.route("/getallfollowers").post(async (req, res) => {
  try {
    const { useridval } = req.body;
    const objid = mongoose.Types.ObjectId(useridval);
    const ooop = await User.find({ userid: objectId });
    const followers = [...ooop[0].followers];
    const records = await getarrayusers(followers);
    res.json({ success: true, records });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
});
router.route("/unfollow").post(async (req, res) => {
  try {
    const { userid } = req.body;
    const objectId = mongoose.Types.ObjectId(userid);
    const followerId = req.uservalueid;
    const userfollowing = req.userfollowing;
    const userdatavalue = req.userdatavalue;
    const docid = req.docid;
    const user = await User.find({ userid: objectId });
    const userobject = user[0];
    const ok = [...userobject.followers].map((x) => x.toString());
    const ko = [...ok].some((x) => x === followerId.toString());
    if (ko === false) {
      // const newuserobject = extend(userobject, {
      //   followers: [...userobject.followers, followerId],
      // });
      // following
      // const newmydoc = extend(userdatavalue, {
      //   following: [...userfollowing, objectId],
      // });
      // user: newuserobject;
      // await User.findByIdAndUpdate(newuserobject._id, newuserobject);
      // await User.findByIdAndUpdate(docid, newmydoc);
      res
        .status(400)
        .json({ success: false, message: "unfollow unsucessfull" });
    }
    if (ko === true) {
      // create an array without that that thing
      const li = [...ok].filter((x) => x !== followerId.toString());
      const lo = [...li].map((x) => mongoose.Types.ObjectId(x));
      const newuserobject = extend(userobject, {
        followers: [...lo],
      });
      // following
      const kiki = [...userfollowing].filter((x) => x.toString() !== userid);
      const newmydoc = extend(userdatavalue, {
        following: [...kiki],
      });

      // user: newuserobject;
      await User.findByIdAndUpdate(newuserobject._id, newuserobject);
      await User.findByIdAndUpdate(docid, newmydoc);
      res.json({ success: true, message: "unfollowed" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
});
module.exports = router;
