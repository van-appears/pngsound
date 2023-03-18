const { TWO_PI } = require("../constants");

module.exports = function (opts) {
  const speed = opts.speed || 1;
  const width = opts.width || 1;
  const offset = opts.offset || 3;
  const scaler = opts.scaler ? opts.scaler : val => val;
  const isAttributeWidth = typeof width === "string";

  let offsets;
  return ({ raw: { row, rows }, col, ...attributes }) => {
    // calculate offsets on first pass
    if (!offsets) {
      offsets = new Array(rows);
      let last = 0,
        wrap = 0;
      for (let index = 0; index < rows; index++) {
        offsets[last] = index + 1;
        last += offset;
        if (last >= rows) {
          last = ++wrap;
        }
      }
      offsets = offsets.map(o => (o *= TWO_PI / rows));
    }

    const useOffset = offsets[row % offsets.length];
    const val = Math.sin(useOffset + TWO_PI * speed * col);
    const position = (isAttributeWidth ? attributes[width] : width) * val;
    const showme = scaler(Math.max(Math.min(0.5 + position / 2, 1), 0));
    return showme;
  };
};
