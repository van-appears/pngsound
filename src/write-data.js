const fs = require("fs");
const wav = require("node-wav");
const { SAMPLE_RATE } = require("./constants");

module.exports = (data, control) => {
  const buffer = wav.encode(data, {
    sampleRate: SAMPLE_RATE,
    bitDepth: 16
  });
  fs.writeFileSync("test.wav", buffer); // TODO
};
