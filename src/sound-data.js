const { DURATION } = require("./constants");
const secondsAsFrames = require("./seconds-as-frames");

module.exports = function (control) {
  const { duration = DURATION } = control;
  const frames = secondsAsFrames(duration);
  return {
    frames,
    data: [new Array(frames).fill(0), new Array(frames).fill(0)]
  };
};
