const secondsAsFrames = require("../seconds-as-frames");

module.exports = function (opts) {
  const { duration, sustain, level, swap } = opts;
  const echoFrames = secondsAsFrames(duration);
  let index = 1;

  return sound => {
    const { frames, data } = sound;
    for (let frame = 0; frame < frames; frame++) {
      let echoValue0 = frame >= echoFrames ? data[0][frame - echoFrames] : 0;
      let echoValue1 = frame >= echoFrames ? data[1][frame - echoFrames] : 0;
      echoValue0 *= sustain * level;
      echoValue1 *= sustain * level;

      if (swap) {
        data[0][frame] += echoValue1;
        data[1][frame] += echoValue0;
      } else {
        data[0][frame] += echoValue0;
        data[1][frame] += echoValue1;
      }
    }
  };
};
