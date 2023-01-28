const expTimbre = require("./exp-timbre");
const halfPi = Math.PI / 2;

module.exports = function (radian, timbre) {
  const val =
    radian < Math.PI ? radian / halfPi - 1 : 1 - (radian - Math.PI) / halfPi;
  return expTimbre(val, timbre);
};
