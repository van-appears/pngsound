const constants = require("./constants");
const oscillators = ["sawtooth", "sine", "square", "triangle"];
const attributes = ["h", "s", "v", "r", "g", "b", "x", "y", "row"];
const scale = ["linear", "exponential"];
const builderAttributes = [
  "timbre",
  "frequency",
  "amplitude",
  "stereoPosition",
  "lowPassCutoff",
  "lowPassResonance"
];

const fields = {
  inputFile: ["string"],
  outputFile: ["string"],
  duration: ["number"],
  rows: ["number", "undefined"],
  startRow: ["number", "undefined"],
  wrap: ["boolean", "undefined"],
  changeRatio: ["number"],
  offsetRatio: ["number"],
  oscillator: ["oscillators", "function", "undefined"],
  post: ["array", "undefined"]
};

builderAttributes.forEach(attr => {
  fields[attr] = ["attributes", "number", "function"];
  fields[`${attr}Min`] = ["number"];
  fields[`${attr}Max`] = ["number"];
  fields[`${attr}Scale`] = ["scale", "undefined"];
  fields[`${attr}ChangeRatio`] = ["number", "undefined"];
});

fields.stereoPosition.push("undefined");
fields.lowPassCutoff.push("undefined");
fields.lowPassResonance.push("undefined");
fields.timbre.push("undefined");

module.exports = function (controls) {
  const errors = [];
  const warnings = [];
  for (let index = 0; index < controls.length; index++) {
    const control = controls[index];
    const prefix = `control[${index}]`;

    Object.keys(fields).forEach(key => {
      const val = control[key];
      const types = fields[key];
      const type = typeof val;

      if (!types) {
        errors.push(prefix + "." + key + " is an unknown property");
      } else if (
        (val === undefined || val === null) &&
        types.includes("undefined")
      ) {
        const defaultVal = constants.ATTRIBUTE_DEFAULTS[key];
        if (defaultVal) {
          warnings.push(`${prefix}.${key} will default to ${defaultVal}`);
        }
      } else if (
        (type === "number" && types.includes("number")) ||
        (type === "boolean" && types.includes("boolean")) ||
        (type === "function" && types.includes("function")) ||
        (type === "string" && types.includes("string")) ||
        (Array.isArray(val) && types.includes("array"))
      ) {
        // then it's fine!
      } else if (type === "string" && types.includes("oscillators")) {
        if (!oscillators.includes(val)) {
          errors.push(
            `${prefix}.${key} string should be one of ${oscillators}`
          );
        }
      } else if (type === "string" && types.includes("attributes")) {
        if (!attributes.includes(val)) {
          errors.push(`${prefix}.${key} string should be one of ${attributes}`);
        }
      } else if (type === "string" && types.includes("scale")) {
        if (!scale.includes(val)) {
          errors.push(`${prefix}.${key} string should be one of ${scale}`);
        }
      } else {
        const parent = builderAttributes.find(x => key.startsWith(x));
        if (parent) {
          const parentType = typeof control[parent];
          if (parentType !== "string" && !(val === null || val === undefined)) {
            console.log(key, val);
            warnings.push(
              `${prefix}.${key} is unnecessary if ${parent} is: ${parentType}`
            );
          }
        } else {
          errors.push(prefix + "." + key + " should be one of " + types);
        }
      }
    });
  }

  errors.forEach(e => console.log(e));
  if (errors.length && warnings.length) {
    console.log();
  }
  warnings.forEach(w => console.log(w));
  return !errors.length;
};
