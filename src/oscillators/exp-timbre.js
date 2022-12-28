module.exports = function(val, timbre) {
  return (timbre === null || timbre === undefined)
    ? val
    : Math.sign(val) * Math.pow(Math.abs(val), Math.pow(2.0, (timbre - 0.5) * 2));
}