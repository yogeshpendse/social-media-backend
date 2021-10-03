const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 7000;
const { connecttodb } = require("./db/db.conn");
const userroute = require("./routes/user.route");
const postroute = require("./routes/post.route");
const interactionroute = require("./routes/interact.route");
const notificationroute = require("./routes/notification.route");
const accountroute = require("./routes/account.route");
const { Notification } = require("./models/notification.model");
const { Post } = require("./models/post.model");
const { authhandler } = require("./middleware/authhandler");
const { errorhandler } = require("./middleware/errorhandler");
const { noroutehandler } = require("./middleware/noroutehandler");
const { User } = require("./models/user.model");
require("dotenv").config();
const apiuri = process.env.API_URI;
connecttodb(apiuri);
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ success: true, route: "/", message: "This server is working." });
});
app.use("/user", userroute);
app.use("/post", postroute);
app.use("/interaction", interactionroute);
app.use("/notification", notificationroute);
app.use("/account", accountroute);

function siouhdfisudhf(arr1, arr2) {
  const array1 = [...arr1]; // post array
  const array2 = [...arr2]; // userid array
  const array3 = array1.map((x) => {
    const newobj = array2.find((op) => x.creator === op.userid.toString());
    // const newobj1 = extendWith(x, {
    //   username: newobj.username,
    //   fullname: newobj.name,
    // });
    const newobj1 = {
      username: newobj.username,
      name: newobj.name,
      ...x._doc,
    };

    return newobj1;
  });
  return array3;
}
app.get("/getallposts", async (req, res) => {
  try {
    const data = await Post.find();
    const useridarray = data.map((x) => mongoose.Types.ObjectId(x.creator));
    const useridarr = [...useridarray];
    // const useridarr = [
    //   mongoose.Types.ObjectId("6146804827515638f46695f5"),
    //   mongoose.Types.ObjectId("61467fc827515638f46695f1"),
    // ];
    const records = await User.find().where("userid").in(useridarr).exec();
    const kbd = siouhdfisudhf(data, records);
    res.json({
      success: true,
      // data,
      // useridarr,
      // records,
      // useridarr,
      kbd,
    });
  } catch (error) {
    res.status(400).json({ success: false, errormessage: error.message });
  }
});
app.get("/getpost/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oo = id; // 6146804827515638f46695f5_1632011474870
    const splitarray = oo.split("_");
    const creator = splitarray[0];
    const nos = Number(splitarray[1]);
    const userid = mongoose.Types.ObjectId(creator);
    const userdata = await User.findOne({ userid });
    const data = await Post.findOne({ creator, postid: nos });
    res.json({
      success: true,
      data: {
        username: userdata.username,
        name: userdata.name,
        postdata: data,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, errormessage: error.message });
  }
});
app.post("/trialroute", (req, res) => {
  const data = req.body;
  const headers = req.headers;
  res.json({ success: true, data, headers });
});
app.get("/getallfollowers", async (req, res) => {
  try {
    // const { useridval } = req.body;
    const useridval = "61467f7a27515638f46695ed";
    const objid = mongoose.Types.ObjectId(useridval);
    const ooop = await User.findOne({ userid: objid });
    const array = [...ooop.followers];
    const records = await User.find().where("userid").in(array).exec();
    res.json({
      success: true,
      followers: ooop.followers,
      followersdata: records,
    });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
});
app.get("/getalllikes/:postval", async (req, res) => {
  try {
    const { postval } = req.params;
    const splitarray = postval.split("_");
    const creator = splitarray[0];
    const postid = Number(splitarray[1]);
    const postdoc = await Post.findOne({ creator, postid });
    const likesarray = [...postdoc.likes].map((x) => x.toString());
    const records = await User.find().where("userid").in(likesarray).exec();
    // const arrayuserid = records.map((x) => x.userid.toString());

    res.json({
      success: true,
      likesarray,
      likeusers: records,
    });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
});
app.get("/getuserdata/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const userdata = await User.findOne({ username });
    if (userdata) {
      const posts = await Post.find({ creator: userdata.userid.toString() });
      return res.json({ success: true, username, userdata, posts });
    }
    res.status(400).json({ success: false });
  } catch (error) {
    res.status(400).json({ success: false });
  }
});
app.use(errorhandler);
app.use(noroutehandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
