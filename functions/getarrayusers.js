const { User } = require("../models/user.model");
async function getarrayusers(arr) {
  const records = await User.find().where("userid").in(arr).exec();
  return records;
}
module.exports = { getarrayusers };
