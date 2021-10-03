const express = require("express");
const bcrypt = require("bcryptjs");
const { isAlphanumeric } = require("validator");
const router = express.Router();
const cors = require("cors");
const { User } = require("../models/user.model");
router.use(cors());
router.use(express.json());
const { signwithjwt } = require("../functions/signwithjwt");
async function hashthispassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  return hashedpassword;
}

router.post("/signup", async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const hashedpassword = await hashthispassword(password);
    const doesuserexist = await User.findOne({ username });
    if (doesuserexist) {
      return res
        .status(400)
        .json({ success: false, message: "user already taken" });
    } else {
      const oll = new User({
        name,
        username,
        password: hashedpassword,
        status: "available",
      });
      await oll.save();
    }
    res.json({ message: "user created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, errormessage: error.message });
  }
});
const checkifpasswordsmatch = async (password, hashedpassword) =>
  await bcrypt.compare(password, hashedpassword);
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // const hashedpassword = await hashthispassword(password);
    const doesuserexist = await User.findOne({ username });
    if (doesuserexist === null) {
      return res
        .status(400)
        .json({ success: false, message: "user doesn't exist" });
    }
    const passmatch = await checkifpasswordsmatch(
      password,
      doesuserexist.password
    );
    if (passmatch) {
      const token = await signwithjwt(doesuserexist.username);
      return res.json({
        success: true,
        username: doesuserexist.username,
        userid: doesuserexist.userid,
        username,
        token,
      });
    }
    if (!passmatch) {
      return res
        .status(400)
        .json({ success: false, errormessage: "passwords don't match" });
    }

    res.json({ success: true, data: doesuserexist, passmatch });
  } catch (error) {
    res.status(400).json({ success: false, errormessage: error.message });
  }
});

module.exports = router;
