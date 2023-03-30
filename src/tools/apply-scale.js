module.exports = function (scale) {
  const applyScale = function (sound) {
    const { frames, data } = sound;
    for (let channel = 0; channel < 2; channel++) {
      for (let frame = 0; frame < frames; frame++) {
        const val = data[channel][frame];
        data[channel][frame] = Math.min(1, Math.max(-1, val * scale));
      }
    }
  };
  applyScale.afterNormalization = true;
  return applyScale;
};
