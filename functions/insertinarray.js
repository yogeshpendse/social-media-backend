function insertinarray(array, interactor) {
  const op = [...array];
  const po = [...op, interactor];
  return po;
}
module.exports = { insertinarray };
