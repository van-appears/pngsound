module.exports = function (radian, timbre) {
  const halfway = (timbre === null || timbre === undefined)
    ? Math.PI
    : 2 * Math.PI * timbre;
  return radian > halfway ? -1 : 1;
};
