module.exports = function (attribute, changeCount, scaler = val => val) {
  let currentValue, nextValue, valueChange, counter;

  // number attributes
  if (
    attribute === null ||
    attribute === undefined ||
    typeof attribute === "number"
  ) {
    return () => () => attribute;
  }

  // function attributes
  if (typeof attribute === "function") {
    return imgData => {
      if (currentValue === undefined) {
        currentValue = nextValue = attribute(imgData);
      } else {
        currentValue = nextValue;
        nextValue = attribute(imgData);
        valueChange = (nextValue - currentValue) / changeCount;
        counter = changeCount;
      }

      return () => {
        if (counter > 0) {
          currentValue += valueChange;
          counter--;
          return currentValue;
        }
        return nextValue;
      };
    };
  }

  // value attributes
  return imgData => {
    if (currentValue === undefined) {
      currentValue = nextValue = imgData[attribute];
    } else {
      currentValue = nextValue;
      nextValue = imgData[attribute];
      valueChange = (nextValue - currentValue) / changeCount;
      counter = changeCount;
    }

    return () => {
      if (counter > 0) {
        currentValue += valueChange;
        counter--;
        return scaler(currentValue);
      }
      return scaler(nextValue);
    };
  };
};
