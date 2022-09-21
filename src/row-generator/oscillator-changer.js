const oscillators = require("../oscillators");

module.exports = function (attribute) {
  const matchOscillator = name => oscillators[name] || oscillators.sine;

  if (
    attribute === null ||
    attribute === undefined ||
    typeof attribute === "string"
  ) {
    return () => matchOscillator(attribute);
  }

  return imgData => {
    try {
      return matchOscillator(attribute(imgData));
    } catch (err) {
      return oscillators.sine;
    }
  };
};
