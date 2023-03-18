const fs = require("fs");
const PNG = require("pngjs").PNG;
const convert = require("color-convert");

module.exports = function (control) {
  const { inputFile, wrap = false, startRow = 0 } = control;
  const imgData = fs.readFileSync(inputFile);
  const img = PNG.sync.read(imgData);
  const { width, height } = img;
  const rows = control.rows || height;
  const pos = (x, y) => (Math.floor(y) * width + Math.floor(x)) << 2;

  const loops = wrap ? Math.floor((height - startRow) / rows) : 1;
  const data = new Array(rows);
  for (let row = 0; row < rows; row++) {
    const rowData = (data[row] = new Array(width * loops));
    let counter = 0;
    for (let loop = 0; loop < loops; loop++) {
      for (let x = 0; x < width; x++) {
        const y = startRow + row + loop * rows;
        const idx = pos(x, y);
        const r = img.data[idx];
        const g = img.data[idx + 1];
        const b = img.data[idx + 2];
        const [h, s, v] = convert.rgb.hsv.raw(r, g, b);

        // normalize all image data as 0->1
        rowData[counter] = {
          r: r / 255,
          g: g / 255,
          b: b / 255,
          h: h / 360,
          s: s / 100,
          v: v / 100,
          row: rows === 1 ? 0.5 : row / (rows - 1),
          col: counter / (rowData.length - 1),
          raw: {
            r,
            g,
            b,
            h,
            s,
            v,
            x,
            y,
            row,
            rows,
            col: counter,
            cols: rowData.length
          }
        };

        counter++;
      }
    }
  }

  return data;
};
