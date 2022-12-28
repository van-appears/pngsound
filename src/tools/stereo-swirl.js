const { TWO_PI } = require("../constants");

module.exports = function (opts) {
  let rows, speed, width, offset;
  if (typeof opts === "number") {
    rows = opts;
    speed = 1;
    width = 1;
    offset = 3;
  } else {
    rows = opts.rows;
    speed = opts.speed || 1;
    width = opts.width || 1;
    offset = opts.offset || 3;
  }

  let offsets = new Array(22);
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

  return ({ raw, col }) => {
    const offset = offsets[raw.row % offsets.length];
    let position = (width * Math.sin(offset + TWO_PI * speed * col)) / 2;
    return Math.max(Math.min(0.5 + position, 1), 0);
  };
};
