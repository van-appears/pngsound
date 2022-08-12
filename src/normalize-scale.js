module.exports = sound => {
  let max = Number.MIN_VALUE;
  const { frames, data } = sound;

  for (let channel = 0; channel < 2; channel++) {
    for (let frame = 0; frame < frames; frame++) {
      max = Math.max(max, Math.abs(data[channel][frame]));
    }
  }

  if (max > 0) {
    const scale = 1.0 / max;
    for (let channel = 0; channel < 2; channel++) {
      for (let frame = 0; frame < frames; frame++) {
        data[channel][frame] *= scale;
      }
    }
  }
};
