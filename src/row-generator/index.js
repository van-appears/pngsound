const { TWO_PI, OFFSET_RATIO_DEFAULT, SAMPLE_RADIAN } = require("../constants");
const oscillatorChanger = require("./oscillator-changer");
const lowpassFilter = require("./lowpass-filter");
const changerBuilder = require("./changer-builder");
const { defaultValue } = require("../tools");

module.exports = function (control, row, offset, index) {
  const { frames, offsetRatio } = control;
  const framesPerCol = frames / row.length;
  const oscillatorChange = oscillatorChanger(control.oscillator);
  const attributeChanger = changerBuilder(control, framesPerCol);
  const amplitudeChanger = attributeChanger("amplitude");
  const resonanceChanger = attributeChanger("resonance");
  const frequencyChanger = attributeChanger("frequency");
  const stereoChanger = attributeChanger("stereoPosition");
  const cutoffChanger = attributeChanger("cutoff");

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
    -framesPerCol * offset * defaultValue(offsetRatio, OFFSET_RATIO_DEFAULT);

  return function () {
    const leftScale = stereo();
    const value = amplitude() * filter(radFn(radian), cutoff(), resonance());
    const values = [leftScale * value, (1.0 - leftScale) * value];
    radian = (radian + frequency() * SAMPLE_RADIAN) % TWO_PI;

    if (frameCounter++ >= framesPerCol) {
      colIndex++;
      frameCounter -= framesPerCol;
      frequency = frequencyChanger(row[colIndex]);
      amplitude = amplitudeChanger(row[colIndex]);
      stereo = stereoChanger(row[colIndex]);
      cutoff = cutoffChanger(row[colIndex]);
      resonance = resonanceChanger(row[colIndex]);
      radFn = oscillatorChange(row[colIndex]);
    }

    return values;
  };
};
