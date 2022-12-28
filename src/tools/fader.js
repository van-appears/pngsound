module.exports = function (opts) {
  const { threshold, descend, rows, attribute } = opts;
  const vals = new Array(rows).fill(0);
  return props => {
    const index = props.raw.row;
    if (props[attribute] > threshold) {
      vals[index] = 1.0;
    } else {
      vals[index] = Math.max(0, vals[index] - descend);
    }
    return vals[index];
  };
};
