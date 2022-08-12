module.exports = function (attribute, changeCount, scaler = val => val) {
  let currentValue, nextValue, valueChange, counter;

  if (
    attribute === null ||
    attribute === undefined ||
    typeof attribute === "number"
  ) {
    return () => () => attribute;
  }

  const useMapFn = typeof attribute === "function";
  return imgData => {
    if (currentValue === undefined) {
      nextValue = useMapFn ? attribute(imgData) : imgData[attribute];
      currentValue = nextValue;
    } else {
      currentValue = nextValue;
      nextValue = useMapFn ? attribute(imgData) : imgData[attribute];
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
