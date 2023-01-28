const childProcess = require("child_process");
const control = require("../sample/control");
const validate = require("./validate");
const os = require("os");
const running = new Set();

const logAll = () => {
  if (running.size > 0) {
    let indexes = "still running";
    running.forEach(i => (indexes += ` ${i}`));
    console.log(indexes);
  } else {
    console.log("done");
  }
};

let index = -1;
const forkIndex = () => {
  index++;
  if (index < control.length) {
    const thisIndex = index;
    const runner = childProcess.fork("./src/runner", [thisIndex]);

    runner.on("spawn", () => {
      running.add(thisIndex);
    });

    runner.on("close", () => {
      running.delete(thisIndex);
      logAll();
      forkIndex();
    });
  }
};

if (validate(control)) {
  let cpuCount = os.cpus().length;
  console.log(cpuCount + " parallel processes");
  const starter = () => {
    forkIndex();
    cpuCount--;
    if (cpuCount > 0) {
      setTimeout(starter, 500);
    }
  };
  setTimeout(starter, 500);
}
