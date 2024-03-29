const { SAMPLE_RATE } = require("../constants");
const MIN_CUTOFF = 20;
const MAX_CUTOFF = 22050;

module.exports = function (control) {
  const { oscillator, lowPassCutoff, lowPassResonance } = control;

  if (
    oscillator === "sine" ||
    lowPassCutoff === null ||
    lowPassCutoff === undefined ||
    lowPassResonance == null ||
    lowPassResonance === undefined
  ) {
    return val => val;
  }

  let y1 = 0,
    y2 = 0,
    y3 = 0,
    y4 = 0;
  let oldx = 0,
    oldy1 = 0,
    oldy2 = 0,
    oldy3 = 0;

  return (val, cutoff, resonance) => {
    const cl = Math.max(MIN_CUTOFF, Math.min(MAX_CUTOFF, cutoff));
    const f = (cl + cl) / SAMPLE_RATE;
    const p = f * (1.8 - 0.8 * f);
    const k = p + p - 1.0;
    const t = (1.0 - p) * 1.386249;
    const t2 = 12.0 + t * t;
    const r = (resonance * (t2 + 6.0 * t)) / (t2 - 6.0 * t);

    const x = val - r * y4;
    y1 = x * p + oldx * p - k * y1;
    y2 = y1 * p + oldy1 * p - k * y2;
    y3 = y2 * p + oldy2 * p - k * y3;
    y4 = y3 * p + oldy3 * p - k * y4;
    y4 -= (y4 * y4 * y4) / 6.0;
    y4 = Math.min(Math.max(-1.0, y4), 1.0);
    oldx = x;
    oldy1 = y1;
    oldy2 = y2;
    oldy3 = y3;

    return y4;
  };
};
