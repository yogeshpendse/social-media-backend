const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
router.use(express.json());

const { Post } = require("../models/post.model");
const { Notification } = require("../models/notification.model");
const { createpostnotifs } = require("../functions/createpostnotifs");
const { authhandler } = require("../middleware/authhandler");

router.use(authhandler);
router.route("/post").post(async (req, res) => {
  try {
    const { postid, content } = req.body;
    const uservalueid = req.uservalueid;
    const creator = uservalueid.toString();
    const arra = req.userfollowers;
    const followersarray = [...arra].map((x) => x.toString());

    const postto = new Post({ postid, creator, content });
    await postto.save();
    if (followersarray.length > 0) {
      const insertarray = await createpostnotifs(
        followersarray,
        creator,
        postid
      );
      await Notification.insertMany(insertarray);
    }
    res.json({ success: true });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, errormessage: error.message, error });
  }
});

module.exports = router;
