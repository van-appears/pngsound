const control = require("../sample/control");
const validate = require("./validate");
const generator = require("./generator");

const runIndex = index => {
  const controlItem = control[index];
  generator(controlItem, (err, percent) => {
    if (err) {
      process.send(JSON.stringify({ err: err.message }));
    } else {
      process.send(JSON.stringify({ index, percent }));
    }
  });
};

const argIndex = parseInt(process.argv[2]);
if (typeof argIndex === "number") {
  runIndex(argIndex);
} else if (validate(control)) {
  for (let index = 0; index < control.length; index++) {
    runIndex(index);
  }
}
