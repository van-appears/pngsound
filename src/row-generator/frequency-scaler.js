module.exports = function (control) {
  const { frequencyMin, frequencyMax } = control;
  const scale = frequencyMax / frequencyMin;
  return val => frequencyMin * Math.pow(scale, val);
};
