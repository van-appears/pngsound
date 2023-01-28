const control = require("../sample/control");
const validate = require("./validate");
const generator = require("./generator");

const runIndex = index => {
  const controlItem = control[index];
  const { inputFile, outputFile } = controlItem;
  const startTime = new Date().getTime();
  console.log("process " + index + " starting " + inputFile);
  generator(controlItem);
  const endTime = new Date().getTime();
  const time = " (" + (endTime - startTime) / 1000 + " seconds)";
  console.log("process " + index + " finished " + outputFile + time);
};

const argIndex = parseInt(process.argv[2]);
if (typeof argIndex === "number") {
  runIndex(argIndex);
} else if (validate(control)) {
  for (let index = 0; index < control.length; index++) {
    runIndex(index);
  }
}
