module.exports = function (min, max) {
  const scale = max / min;
  return val => min * Math.pow(scale, val);
};
