function noroutehandler(req, res) {
  res.status(404).json({ success: false, message: "Route nahi hai." });
}
module.exports = { noroutehandler };
