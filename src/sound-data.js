const { DURATION, SAMPLE_RATE } = require("./constants");

module.exports = function (control) {
  const { duration = DURATION } = control;
  const frames = Math.floor(SAMPLE_RATE * duration);
  return {
    frames,
    data: [new Array(frames).fill(0), new Array(frames).fill(0)]
  };
};
