const allFiles = new Array(18).fill(0).map((_, i) => `image${i + 1}`);

/*module.exports = allFiles.map(f => ({
  inputFile: `sample/${f}.png`,
  outputFile: `sample/${f}_1.wav`,
  duration: 180,
  rows: 20,
  startRow: 0,
  wrap: false,
  changeRatio: 0.666,
  offsetRatio: 0.666,
  frequency: "h",
  frequencyMin: 110,
  frequencyMax: 880,
  amplitude: "v",
  stereoPosition: "row",
  oscillator: "sine",
  lowPassCutoff: null,
  lowPassResonance: null
}));*/

module.exports = [
  /*{
    inputFile: "sample/image10.png",
    outputFile: "sample/image10_1.wav",
    duration: 180,
    rows: 20,
    startRow: 0,
    wrap: false,
    changeRatio: 0.666,
    offsetRatio: 0.666,
    frequency: "h",
    frequencyMin: 110,
    frequencyMax: 880,
    amplitude: "v",
    stereoPosition: "row",
    oscillator: ({ s }) => (s > 0.8 ? "sawtooth" : "sine")
  },
  {
    inputFile: "sample/image10.png",
    outputFile: "sample/image10_2.wav",
    duration: 180,
    changeRatio: 0.666,
    offsetRatio: 0.666,
    frequency: "h",
    frequencyMin: 110,
    frequencyMax: 880,
    amplitude: "v",
    stereoPosition: "row"
  },
  {
    inputFile: "sample/image10.png",
    outputFile: "sample/image10_3.wav",
    rows: 20,
    duration: 180,
    changeRatio: 0.666,
    offsetRatio: 0.666,
    frequency: "v",
    frequencyMin: 110,
    frequencyMax: 880,
    amplitude: ({ s }) => (s > 0.7 ? 1 : 0),
    stereoPosition: "row"
  },*/
  {
    inputFile: "sample/image10.png",
    outputFile: "sample/image10_4.wav",
    rows: 20,
    duration: 180,
    frequencyChangeRatio: 0,
    changeRatio: 1.0,
    offsetRatio: 0.666,
    frequency: ({ h, row }) => {
      switch (Math.floor(h * 5)) {
        case 0:
          return 440 + (row / 10);
        case 1:
          return 495 + (row / 10);
        case 2:
          return 556.875 + (row / 10);
        case 3:
          return 660 + (row / 10);
        case 4:
          return 742.5 + (row / 10);
      }
    },
    amplitude: "v",
    stereoPosition: "row"
  }
];
