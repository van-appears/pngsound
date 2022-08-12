const {
  TWO_PI,
  CHANGE_RATIO_DEFAULT,
  OFFSET_RATIO_DEFAULT,
  SAMPLE_RADIAN
} = require("../constants");
const valueChanger = require("./value-changer");
const frequencyScaler = require("./frequency-scaler");
const stereoScaler = require("./stereo-scaler");
const lowpassFilter = require("./lowpass-filter");
const def = (val, alt) => (val === null || val === undefined ? alt : val);

module.exports = function (control, row, offset) {
  const { frames, oscillator, changeRatio, offsetRatio } = control;
  const radFn = require(`./${oscillator}`);
  const framesPerCol = frames / row.length;
  const changeCount = Math.floor(
    def(changeRatio, CHANGE_RATIO_DEFAULT) * framesPerCol
  );

  const amplitudeChanger = valueChanger(control.amplitude, changeCount);
  const resonanceChanger = valueChanger(control.lowPassResonance, changeCount);
  const frequencyChanger = valueChanger(
    control.frequency,
    changeCount,
    frequencyScaler(control)
  );
  const stereoChanger = valueChanger(
    control.stereoPosition,
    changeCount,
    stereoScaler()
  );
  const cutoffChanger = valueChanger(
    control.lowPassCutoff,
    changeCount,
    frequencyScaler(control)
  );

  let rowIndex = 0;
  let radian = 0;
  let frequency = frequencyChanger(row[0]);
  let amplitude = amplitudeChanger(row[0]);
  let stereo = stereoChanger(row[0]);
  let cutoff = cutoffChanger(row[0]);
  let resonance = resonanceChanger(row[0]);
  let filter = lowpassFilter(control);
  let frameCounter =
    -framesPerCol * offset * def(offsetRatio, OFFSET_RATIO_DEFAULT);

  return function () {
    const leftScale = stereo();
    const value = amplitude() * filter(radFn(radian), cutoff(), resonance());
    const values = [leftScale * value, (1.0 - leftScale) * value];
    radian = (radian + frequency() * SAMPLE_RADIAN) % TWO_PI;

    if (frameCounter++ >= framesPerCol) {
      rowIndex++;
      frequency = frequencyChanger(row[rowIndex]);
      amplitude = amplitudeChanger(row[rowIndex]);
      stereo = stereoChanger(row[rowIndex]);
      cutoff = cutoffChanger(row[rowIndex]);
      resonance = resonanceChanger(row[rowIndex]);
      frameCounter -= framesPerCol;
    }

    return values;
  };
};
