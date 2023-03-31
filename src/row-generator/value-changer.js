module.exports = function (attributeVal, changeCount, scaler = val => val) {
  let currentValue, nextValue, valueChange, counter;

  // number attributeVal
  if (
    attributeVal === null ||
    attributeVal === undefined ||
    typeof attributeVal === "number"
  ) {
    return () => () => attributeVal;
  }

  // function attributeVal
  if (typeof attributeVal === "function") {
    return imgData => {
      if (currentValue === undefined) {
        currentValue = nextValue = attributeVal(imgData);
      } else {
        currentValue = nextValue;
        nextValue = attributeVal(imgData);
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

  // string attributeVal
  return imgData => {
    if (currentValue === undefined) {
      currentValue = nextValue = imgData[attributeVal];
    } else {
      currentValue = nextValue;
      nextValue = imgData[attributeVal];
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
