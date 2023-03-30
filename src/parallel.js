const os = require("os");
const MultiProgress = require("multi-progress");
const childProcess = require("child_process");
const control = require("../sample/control");
const validate = require("./validate");

const multi = new MultiProgress();
const running = new Set();
const errors = [];
let progressBars;
let overallBar;

const checkFinished = () => {
  if (running.size === 0) {
    overallBar.update(100);
    console.log();
  }
};

let index = -1;
const forkIndex = cpuIndex => {
  index++;
  if (index < control.length) {
    const thisIndex = index;
    const runner = childProcess.fork("./src/runner", [thisIndex]);
    progressBars[cpuIndex].update(0, { message: `control[${thisIndex}]` });

    runner.on("spawn", () => {
      running.add(thisIndex);
    });

    runner.on("message", message => {
      const { err, index, percent } = JSON.parse(message);
      if (err) {
        errors[index] = err;
        progressBars[cpuIndex].tick(0, {
          message: `failed control[${thisIndex}]`
        });
        progressBars[cpuIndex].terminate();
      } else {
        progressBars[cpuIndex].tick(1, {
          message: `running control[${thisIndex}]`
        });
        overallBar.tick(1);
      }
    });

    runner.on("close", () => {
      running.delete(thisIndex);
      progressBars[cpuIndex].update(100, {
        message: `completed control[${thisIndex}]`
      });
      forkIndex(cpuIndex);
      checkFinished();
    });
  }
};

if (validate(control)) {
  let cpuCount = os.cpus().length;
  console.log("max " + cpuCount + " parallel processes");
  progressBars = new Array(Math.min(cpuCount, control.length))
    .fill(0)
    .map((c, i) => {
      return multi.newBar(
        "process[" + i + "] [:bar] :percent :etas - :message",
        {
          complete: "=",
          incomplete: " ",
          width: 20,
          total: 100
        }
      );
    });
  overallBar = multi.newBar("overall [:bar] :percent :elapsed", {
    complete: "=",
    incomplete: " ",
    width: 20,
    total: control.length * 100
  });
  overallBar.tick(0);

  let cpuIndex = 0;
  const starter = () => {
    forkIndex(cpuIndex);
    cpuIndex++;
    if (cpuIndex < cpuCount) {
      setTimeout(starter, 100);
    }
  };
  starter();
}
