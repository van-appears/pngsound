const sineSwirl = require("../src/tools/sine-swirl");
const echo = require("../src/tools/echo");
const frameFunction = require("../src/tools/frame-function");
const expTimbre = require("../src/oscillators/exp-timbre");
const applyFades = require("../src/tools/apply-fades");
const applyScale = require("../src/tools/apply-scale");

module.exports = [
  {
    inputFile: `sample/combined.png`,
    outputFile: `sample/process1.wav`,
    duration: 180,
    rows: 228,
    oscillator: "triangle",
    timbre: 0.5,
    changeRatio: 0.666,
    offsetRatio: 0.666,
    frequency: "v",
    frequencyMin: 880,
    frequencyMax: 110,
    amplitude: "h",
    stereoPosition: "row"
  },
  {
    inputFile: `sample/combined.png`,
    outputFile: `sample/process2.wav`,
    changeRatio: 1.0,
    offsetRatio: 0.666,
    duration: 180,
    startRow: 228,
    rows: 23,
    oscillator: "square",
    frequency: "h",
    frequencyMin: 20,
    frequencyMax: 800,
    timbre: "s",
    lowPassResonance: 0.833,
    amplitude: "v",
    stereoPosition: ({ raw: { row, col } }) => (row + col) % 2 ? 0 : 1,
    lowPassCutoff: sineSwirl({
      speed: 11,
      scaler: val => 60 + val * 1400
    }),
    post: [
      echo({ duration: 0.073, sustain: 0.2 }),
      applyFades({ fadeOut: 5 })
    ]
  },
  {
    inputFile: `sample/combined.png`,
    outputFile: `sample/process3.wav`,
    startRow: 251,
    rows: 162,
    duration: 180,
    oscillator: "sawtooth",
    timbre: "s",
    changeRatio: 1.0,
    offsetRatio: 0.666,
    frequencyChangeRatio: 0,
    frequency: ({ h, row }) => {
      switch (Math.floor(h * 6)) {
        case 0:
          return 330 + row / 10;
        case 1:
          return 371.25 + row / 10;
        case 2:
          return 440 + row / 10;
        case 3:
          return 495 + row / 10;
        case 4:
          return 556.875 + row / 10;
        case 5:
          return 660 + row / 10;
      }
    },
    amplitude: "v",
    amplitudeMin: 0.5,
    amplitudeMax: 1.0,
    stereoPosition: sineSwirl({ speed: 3 }),
    post: [
      applyScale(0.9),
      applyFades({ fadeIn: 20, fadeOut: 20 })
    ]
  },
  {
    inputFile: `sample/combined.png`,
    outputFile: `sample/process4.wav`,
    duration: 180,
    changeRatio: 0.666,
    offsetRatio: 0.666,
    startRow: 413,
    rows: 23,
    oscillator: "sawtooth",
    frequency: "row",
    frequencyMin: 100,
    frequencyMax: 800,
    amplitude: "v",
    lowPassCutoff: "h",
    lowPassCutoffMin: 20,
    lowPassCutoffMax: 1000,
    lowPassResonance: 0.707,
    post: [
      echo({ duration: 0.6, sustain: 0.5, level: 0.3, left: true }),
      echo({ duration: 0.61, sustain: 0.5, level: 0.3, right: true }),
      applyFades({ fadeOut: 10 })
    ]
  },
  {
    inputFile: `sample/combined.png`,
    outputFile: `sample/process5.wav`,
    duration: 180,
    changeRatio: 0.666,
    offsetRatio: 0.666,
    startRow: 436,
    rows: 492,
    frequency: "v",
    frequencyMin: 220,
    frequencyMax: 880,
    amplitude: "h",
    stereoPosition: "row"
  },
  {
    inputFile: `sample/combined.png`,
    outputFile: `sample/process6.wav`,
    duration: 180,
    changeRatio: 0.666,
    offsetRatio: 0.666,
    startRow: 928,
    rows: 23,
    oscillator: "square",
    frequency: 110,
    timbre: "h",
    amplitude: 1,
    lowPassCutoff: "v",
    lowPassCutoffMin: 800,
    lowPassCutoffMax: 20,
    lowPassResonance: 1,
    stereoPosition: "row",
    post: [
      frameFunction((value, { frame, frames }) =>
        expTimbre(value, frame / frames)
      )
    ]
  },
  {
    inputFile: `sample/combined.png`,
    outputFile: `sample/process7.wav`,
    duration: 180,
    changeRatio: 1,
    offsetRatio: 1,
    startRow: 951,
    rows: 108,
    oscillator: "triangle",
    frequency: ({ r }) => Math.pow(6, Math.floor(7 * r)),
    amplitude: "g",
    stereoPosition: "row"
  },
  {
    inputFile: `sample/combined.png`,
    outputFile: `sample/process8.wav`,
    duration: 180,
    oscillator: ({ h }) => ["square","sawtooth","triangle","sine"][Math.floor(4 * h)],
    frequencyChangeRatio: 0.3,
    changeRatio: 1,
    offsetRatio: 1,
    startRow: 1059,
    rows: 26,
    frequency: "g",
    frequencyMin: 600,
    frequencyMax: 400,
    timbre: "b",
    amplitude: "s",
    stereoPosition: sineSwirl({ width: "v" }),
    post: [
      echo({ duration: 0.111, sustain: 0.9 })
    ]
  },
  {
    inputFile: `sample/combined.png`,
    outputFile: `sample/process9.wav`,
    duration: 180,
    oscillator: "sine",
    changeRatio: 1,
    offsetRatio: 1,
    startRow: 1059,
    rows: 191,
    frequency: ({ raw }) => raw.r,
    amplitude: "g",
    stereoPosition: "b",
    post: [
      frameFunction(value => expTimbre(value, 0.5))
    ]
  },
  {
    inputFile: `sample/combined.png`,
    outputFile: `sample/process10.wav`,
    duration: 180,
    changeRatio: 0.5,
    offsetRatio: 0,
    startRow: 1250,
    rows: 2,
    wrap: true,
    frequency: "h",
    frequencyMin: 1000,
    frequencyMax: 100,
    oscillator: "sawtooth",
    amplitude: "v",
    lowPassResonance: 0.707,
    lowPassCutoff: ({ col, s }) => {
      const min = 20 + (col * 1980); // 20 -> 2000;
      const max = 2000 - (col * 1980); // 2000 -> 20;
      const val = min + (s * (max - min));
      return val;
    },
    stereoPosition: "row",
    post: [
      echo({ duration: 0.01, sustain: 0.3 }),
      applyScale(0.9)
    ]
  }
];
