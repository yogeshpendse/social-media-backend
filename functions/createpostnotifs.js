const mongoose = require("mongoose");
function createpostnotifs(followersarray, userx, postid) {
  const oo = [...followersarray].map((x) => {
    const op = {
      creator: mongoose.Types.ObjectId(userx),
      postid: postid,
      type: "post",
      targetedat: mongoose.Types.ObjectId(x),
      targetedby: mongoose.Types.ObjectId(userx),
    };
    return op;
  });
  return oo;
}

module.exports = { createpostnotifs };
