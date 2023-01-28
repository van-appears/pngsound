module.exports = function (fn) {
  return sound => {
    const { frames, data } = sound;
    for (let channel = 0; channel < 2; channel++) {
      for (let frame = 0; frame < frames; frame++) {
        data[channel][frame] = fn(data[channel][frame], {
          frame,
          channel,
          frames
        });
      }
    }
  };
};
