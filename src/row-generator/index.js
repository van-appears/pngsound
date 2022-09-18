const {
  TWO_PI,
  CHANGE_RATIO_DEFAULT,
  OFFSET_RATIO_DEFAULT,
  SAMPLE_RADIAN
} = require("../constants");
const valueChanger = require("./value-changer");
const oscillatorChanger = require("./oscillator-changer");
const frequencyScaler = require("./frequency-scaler");
const stereoScaler = require("./stereo-scaler");
const lowpassFilter = require("./lowpass-filter");

const def = (val, alt) => (val === null || val === undefined ? alt : val);

module.exports = function (control, row, offset) {

  const { frames, changeRatio, offsetRatio } = control;
  const framesPerCol = frames / row.length;
  const changeCount = attr => def(control[attr], def(changeRatio, CHANGE_RATIO_DEFAULT)) * framesPerCol;

  const oscillatorChange = oscillatorChanger(control.oscillator);
  const amplitudeChanger = valueChanger(
    control.amplitude,
    changeCount(control.amplitudeChangeRatio)
  );
  const resonanceChanger = valueChanger(
    control.lowPassResonance,
    changeCount(control.lowPassResonanceChangeRatio)
  );
  const frequencyChanger = valueChanger(
    control.frequency,
    changeCount(control.frequencyChangeRatio),
    frequencyScaler(control.frequencyMin, control.frequencyMax)
  );
  const stereoChanger = valueChanger(
    control.stereoPosition,
    changeCount(control.stereoPositionChangeRatio),
    stereoScaler()
  );
  const cutoffChanger = valueChanger(
    control.lowPassCutoff,
    changeCount(control.lowPassCutoffChangeRatio),
    frequencyScaler(control.lowPassCutoffMin, control.lowPassCutoffMax)
  );

  let colIndex = 0;
  let radian = 0;
  let frequency = frequencyChanger(row[0]);
  let amplitude = amplitudeChanger(row[0]);
  let stereo = stereoChanger(row[0]);
  let cutoff = cutoffChanger(row[0]);
  let resonance = resonanceChanger(row[0]);
  let radFn = oscillatorChange(row[0]);
  let filter = lowpassFilter(control);
  let frameCounter =
    -framesPerCol * offset * def(offsetRatio, OFFSET_RATIO_DEFAULT);

  return function () {
    const leftScale = stereo();
    const value = amplitude() * filter(radFn(radian), cutoff(), resonance());
    const values = [leftScale * value, (1.0 - leftScale) * value];
    radian = (radian + frequency() * SAMPLE_RADIAN) % TWO_PI;

    if (frameCounter++ >= framesPerCol) {
      colIndex++;
      frequency = frequencyChanger(row[colIndex]);
      amplitude = amplitudeChanger(row[colIndex]);
      stereo = stereoChanger(row[colIndex]);
      cutoff = cutoffChanger(row[colIndex]);
      resonance = resonanceChanger(row[colIndex]);
      radFn = oscillatorChange(row[colIndex]);
      frameCounter -= framesPerCol;
    }

    return values;
  };
};
