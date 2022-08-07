const fs = require("fs");
const PNG = require("pngjs").PNG;
const convert = require("color-convert");
const { ROWS } = require("./constants");

module.exports = function (control) {
  const { inputFile, rows = ROWS, wrap = false, startRow = 0 } = control;
  const imgData = fs.readFileSync(inputFile);
  const img = PNG.sync.read(imgData);
  const { width, height } = img;
  const pos = (x, y) => (Math.floor(y) * width + Math.floor(x)) << 2;

  let y = startRow;
  const loops = wrap ? Math.floor(height / rows) : 1;
  const data = new Array(rows);
  for (let row = 0; row < rows; row++) {
    const rowData = (data[y] = new Array(width * loops));
    let counter = 0;
    for (let loop = 0; loop < loops; loop++) {
      for (let x = 0; x < width; x++) {
        const y = loop * rows + row;
        const idx = pos(x, y);
        const r = img.data[idx];
        const g = img.data[idx + 1];
        const b = img.data[idx + 2];
        const [h, s, v] = convert.rgb.hsv.raw(r, g, b);

        // normalize all image data as 0->1
        rowData[counter++] = {
          r: r / 255,
          g: g / 255,
          b: b / 255,
          h: h / 360,
          s: s / 100,
          v: v / 100,
          x,
          y,
          row
        };
      }
    }
  }

  return data;
};
