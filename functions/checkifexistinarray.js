const mongoose = require("mongoose");
function checkifexistinarray(array, object) {
  const ok = [...array].some((x) => x === object);
  return ok;
}
module.exports = { checkifexistinarray };
