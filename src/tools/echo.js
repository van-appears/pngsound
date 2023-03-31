const secondsAsFrames = require("../seconds-as-frames");

module.exports = function (opts) {
  const { duration, sustain, level, left, right } = opts;
  const echoFrames = secondsAsFrames(duration);
  const useSustain = sustain || 1;
  const useLevel = level || 1;

  return sound => {
    const { frames, data } = sound;
    for (let frame = 0; frame < frames; frame++) {
      let echoValue0 = frame >= echoFrames ? data[0][frame - echoFrames] : 0;
      let echoValue1 = frame >= echoFrames ? data[1][frame - echoFrames] : 0;
      echoValue0 *= useSustain * useLevel;
      echoValue1 *= useSustain * useLevel;

      if (left) {
        data[0][frame] += echoValue0;
      }
      if (right) {
        data[1][frame] += echoValue1;
      }
    }
  };
};
