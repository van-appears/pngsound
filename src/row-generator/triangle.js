const halfPi = Math.PI / 2;

module.exports = function (radian) {
  return radian < Math.PI
    ? radian / halfPi - 1
    : 1 - (radian - Math.PI) / halfPi;
};
