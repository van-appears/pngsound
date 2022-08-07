const { SAMPLE_RADIAN } = require("../constants");

module.exports = function (controls) {
  // TODO base frequency off attributes
  return val => 120 * Math.pow(4.0, val) * SAMPLE_RADIAN;
};
