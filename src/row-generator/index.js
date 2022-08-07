const { TWO_PI } = require("../constants");
const valueChanger = require("./value-changer");
const frequencyScaler = require("./frequency-scaler");
const stereoScaler = require("./stereo-scaler");

module.exports = function (control, row, offset) {
  const { frames, oscillator } = control;
  const radFn = require(`./${oscillator}`);
  const framesPerCol = frames / row.length;

  const radianChanger = valueChanger(
    control.frequency,
    framesPerCol,
    frequencyScaler()
  );
  const amplitudeChanger = valueChanger(
    control.amplitude,
    framesPerCol
  );
  const stereoChanger = valueChanger(
    control.stereoPosition,
    framesPerCol,
    stereoScaler()
  );
  const cutoffChanger = valueChanger(
    control.lowPassCutoff,
    framesPerCol
  );
  const resonanceChanger = valueChanger(
    control.lowPassResonance,
    framesPerCol
  );

  let rowIndex = 0;
  let radian = 0;
  let radianChange = radianChanger(row[0]);
  let amplitude = amplitudeChanger(row[0]);
  let stereo = stereoChanger(row[0]);
  let cutoff = cutoffChanger(row[0]);
  let resonance = resonanceChanger(row[0]);
  let changeCounter = -offset * framesPerCol / 3;

  return function () {
    const leftScale = stereo();
    const value = amplitude() * radFn(radian);
    const values = [leftScale * value, (1.0 - leftScale) * value];
    radian = (radian + radianChange()) % TWO_PI;

    if (changeCounter++ >= framesPerCol) {
      rowIndex++;
      radianChange = radianChanger(row[rowIndex]);
      amplitude = amplitudeChanger(row[rowIndex]);
      stereo = stereoChanger(row[rowIndex]);
      cutoff = cutoffChanger(row[rowIndex]);
      resonance = resonanceChanger(row[rowIndex]);
      changeCounter -= framesPerCol;
    }

    return values;
  };
};
