const imgRowData = require("./img-row-data");
const soundData = require("./sound-data");
const rowGenerator = require("../row-generator");
const normalizeScale = require("./normalize-scale");
const writeData = require("./write-data");

module.exports = function (control) {
  const inputData = imgRowData(control);
  const outputData = soundData(control);
  control.frames = outputData.frames;
  const rowGenerators = inputData.map((row, index) =>
    rowGenerator(control, row, index / inputData.length, index)
  );

  for (let index = 0; index < outputData.frames; index++) {
    const values = rowGenerators.reduce(
      (acc, gen) => {
        const [left, right] = gen();
        acc[0] += left;
        acc[1] += right;
        return acc;
      },
      [0, 0]
    );

    outputData.data[0][index] = values[0];
    outputData.data[1][index] = values[1];
  }

  (control.post || []).forEach(postProcess => postProcess(outputData));
  normalizeScale(outputData);
  writeData(outputData.data, control);
};
