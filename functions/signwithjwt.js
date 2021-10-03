const jwt = require("jsonwebtoken");
async function signwithjwt(usernameval) {
  const token = jwt.sign({ username: usernameval }, "secret", {
    expiresIn: "24h",
  });
  return token;
}
module.exports = { signwithjwt };
