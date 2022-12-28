const hasValue = val => val !== null && val !== undefined;
const defaultValue = (val, fallback) => (hasValue(val) ? val : fallback);

module.exports = {
  hasValue,
  defaultValue
};
