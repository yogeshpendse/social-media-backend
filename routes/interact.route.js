const express = require("express");
const mongoose = require("mongoose");
const { extend } = require("lodash");
const router = express.Router();
router.use(express.json());

const { Post } = require("../models/post.model");
const { insertinarray } = require("../functions/insertinarray");
const { checkifexistinarray } = require("../functions/checkifexistinarray");
const { Notification } = require("../models/notification.model");
const { createpostnotifs } = require("../functions/createpostnotifs");
const { authhandler } = require("../middleware/authhandler");
const { User } = require("../models/user.model");

router.use(authhandler);
router
  .route("/like")
  .get(async (req, res) => {
    res.json({ success: true, message: "it works" });
  })
  .post(async (req, res) => {
    try {
      console.log("initial checkpoint");
      const { creator, postid } = req.body;
      const likedposts = req.likedposts;
      const docid = req.docid;
      const userval = req.userval;
      const uniqueid = creator + "_" + JSON.stringify(postid);
      const uservalueid = req.uservalueid;
      const interactor = uservalueid.toString();
      const posts = await Post.find({ creator, postid });
      const op = posts[0];
      console.log("checkpoint 1");
      const strigifiedarray = [...op.likes].map((x) => x.toString());
      const okifunc = (array, object) => [...array].some((x) => x === object);
      const boolval = okifunc(strigifiedarray, interactor);
      if (creator === uservalueid.toString()) {
        return res
          .status(400)
          .json({ success: false, message: "You can't like your own post" });
      }
      // const po = [...op.likes, mongoose.Types.ObjectId(interactor)];
      if (boolval) {
        console.log("final checkpoint");
        return res
          .status(400)
          .json({ success: false, errormessage: "already liked" });
      } else {
        try {
          console.log("checkpoint 2");
          const po = [...op.likes, mongoose.Types.ObjectId(interactor)];
          const ko = extend(op, { likes: po });
          const idtoupdate = ko._id;
          await Post.findByIdAndUpdate(idtoupdate, ko);
          const opk = [...likedposts].some((x) => x === uniqueid);
          if (opk === false) {
            const newarr1 = [...likedposts, uniqueid];
            const newuserupdate = extend(userval, { likedposts: newarr1 });
            await User.findByIdAndUpdate(docid, newuserupdate);
          }
          console.log("checkpoint 3");
          const creatorval = mongoose.Types.ObjectId(creator);
          const postidval = String(postid);
          const interacval = mongoose.Types.ObjectId(interactor);
          const Notifsave = new Notification({
            creator: creatorval, //creator
            postid: postidval, //postid
            type: "like",
            targetedat: creatorval, // creator
            targetedby: interacval, // interactor
          });
          console.log("gearing up to post notif2");
          console.log("checkpoint 4");
          await Notifsave.save();
          console.log("final checkpoint");
          res.json({ success: true });
        } catch (error) {
          console.log(error);
          res.status(400).json({ success: false });
        }
      }
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  });

module.exports = router;
