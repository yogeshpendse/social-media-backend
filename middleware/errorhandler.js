function errorhandler(err, req, res, next) {
  console.log(err);
  res.status(500).json({ success: false, errormessage: err.message });
}
module.exports = { errorhandler };
