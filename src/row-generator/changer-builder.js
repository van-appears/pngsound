const valueChanger = require("./value-changer");
const constants = require("../constants");
const { hasValue } = require("../tools");

const linearScaler = (min, max) => {
  const diff = max - min;
  return val => min + (val * diff);
};

const exponentialScaler = (min, max) => {
  const diff = max / min;
  return val => min * Math.pow(diff, val);
};

module.exports = function(control, framesPerCol) {
  const getValue = name => hasValue(control[name])
    ? control[name]
    : constants.ATTRIBUTE_DEFAULTS[name];
  const changeCount = name => {
    const val = hasValue(name)
      ? getValue(name)
      : getValue('changeRatio');
    return val * framesPerCol;
  }
  const scaler = (min, max, scale) => {
    if (hasValue(min) && hasValue(max)) {
      return (getValue(scale) === 'exponential')
        ? exponentialScaler(min, max)
        : linearScaler(min, max);
    }
    return val => val;
  };

  return function(attributeName) {
    const controller = getValue(attributeName);
    const min = getValue(`${attributeName}Min`);
    const max = getValue(`${attributeName}Max`);
    const scale = getValue(`${attributeName}Scale`);
    const changeRatio = getValue(`${attributeName}ChangeRatio`);

    return valueChanger(
      controller,
      changeCount(changeRatio),
      scaler(min, max, scale)
    );
  }
}
