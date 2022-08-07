const control = require("../sample/control");
const validate = require("./validate");
const generator = require("./generator");

if (validate(control)) {
  control.forEach((c, i) => {
    console.time("process " + i);
    generator(c);
    console.timeLog("process " + i);
  });
}
