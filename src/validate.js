const fields = {
  inputFile: "string",
  outputFile: "string",
  duration: "number",
  rows: "number",
  startRow: "number",
  wrap: "boolean",
  changeRatio: "number",
  offsetRatio: "number",
  frequency: "attribute",
  frequencyMin: "number",
  frequencyMax: "number",
  frequencyChangeRatio: "number",
  amplitude: "attribute",
  amplitudeChangeRatio: "number",
  stereoPosition: "attribute",
  stereoPositionChangeRatio: "number",
  lowPassCutoff: "attribute",
  lowPassCutoffChangeRatio: "attribute",
  lowPassResonance: "attribute",
  lowPassResonanceChangeRatio: "attribute",
  oscillator: "oscillator"
};

const oscillators = ["sawtooth", "sine", "square", "triangle"];
const colourAttributes = ["h", "s", "v", "r", "g", "b", "x", "y", "row"];

const validators = {
  string: val => val.trim().length > 0,
  number: val => val > 0,
  boolean: () => true,
  attribute: val =>
    typeof val === "number" ||
    typeof val === "function" ||
    (typeof val === "string" && colourAttributes.includes(val)),
  oscillator: val => typeof val === "function" ||
    (typeof val === "string" && oscillators.includes(val))
};

module.exports = function (controls) {
  const errors = [];
  for (let index = 0; index < controls.length; index++) {
    const control = controls[index];
    const prefix = `control[${index}]`;

    // TODO mandatory fields

    Object.keys(control).forEach(key => {
      const val = control[key];
      const type = fields[key];
      if (!type) {
        errors.push(prefix + "." + key + " is an unknown property");
      } else if (val && !validators[type](val)) {
        errors.push(prefix + "." + key + " is not a valid " + type);
      }
    });
  }

  if (errors.length) {
    errors.forEach(e => console.log(e));
    return false;
  }

  return true;
};
