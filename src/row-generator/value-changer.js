module.exports = function (attribute, framesPerCol, scaler = val => val) {
  const changeCount = Math.floor(framesPerCol * 2 / 3);
  let currentValue, nextValue, valueChange, counter;

  // if the control attribute is a number, then just use that as a constant
  if (typeof attribute === "number") {
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
