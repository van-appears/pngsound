const secondsAsFrames = require("../seconds-as-frames");

module.exports = opts => {
  const { fadeIn, fadeOut } = opts;
  return sound => {
    const { frames, data } = sound;

    if (fadeIn > 0) {
      const totalFrames = Math.min(frames, secondsAsFrames(fadeIn));
      for (let frame = 0; frame < totalFrames; frame++) {
        const scale = frame / totalFrames;
        for (let channel = 0; channel < 2; channel++) {
          data[channel][frame] *= scale;
        }
      }
    }

    if (fadeOut > 0) {
      const totalFrames = Math.min(frames, secondsAsFrames(fadeOut));
      for (let frame = 0; frame < totalFrames; frame++) {
        const scale = frame / totalFrames;
        for (let channel = 0; channel < 2; channel++) {
          data[channel][frames - frame] *= scale;
        }
      }
    }
  };
};
