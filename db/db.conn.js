const mongoose = require("mongoose");
// mongodb+srv://Arcyogesh:WCj804l9BDHDqRS9@myecomm.aoyhu.mongodb.net/socialmedia?retryWrites=true&w=majority
function connecttodb(uri) {
  // const uri =
  // "mongodb+srv://Arcyogesh:WCj804l9BDHDqRS9@myecomm.aoyhu.mongodb.net/socialmedia?retryWrites=true&w=majority";
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.log("connection success"))
    .catch((error) => console.log("connection failed"));
}

module.exports = { connecttodb };
