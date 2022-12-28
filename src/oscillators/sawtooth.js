const expTimbre = require("./exp-timbre");

module.exports = function (radian, timbre) {
  return expTimbre(radian / Math.PI - 1, timbre);
};
