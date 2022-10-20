module.exports = {
  DURATION: 180,
  OFFSET_RATIO_DEFAULT: 0.333,
  SAMPLE_RATE: 44100,
  SAMPLE_RADIAN: (Math.PI * 2.0) / 44100,
  TWO_PI: Math.PI * 2.0,
  ATTRIBUTE_DEFAULTS: {
    changeRatio: 0.666,
    frequencyScale: "exponential",
    lowPassCutoffScale: "exponential",
    stereoPosition: 0.5,
    stereoPositionMin: 0.25,
    stereoPositionMax: 0.75,
    oscillator: "sine"
  }
};
