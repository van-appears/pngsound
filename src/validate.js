module.exports = function (controls) {
  const errors = [];
  const strCheck = val => val && typeof val !== 'string' && val.trim().length === 0;
  const numCheck = val => val && typeof val === 'number' && val > 0;
  const oscillators = ['sawtooth', 'sine', 'square', 'triangle'];

  for (let index=0; index<controls.length; index++) {
    const control = controls[index];
    const prefix = `control[${index}]`

    if (!strCheck(control.inputFile)) {
      errors.push(prefix + '.inputFile is a required string (file path)');
    }
    if (!strCheck(control.inputFile)) {
      errors.push(prefix + '.outputFile is a required string (file path)');
    }
    if (!numCheck(control.duration)) {
      errors.push(prefix + '.duration is a required number (in seconds)');
    }
    if (!strCheck(control.oscillator)) {
      errors.push(prefix + '.oscillator is a required string');
    }
    if (!oscillators.includes(control.oscillator)) {
      errors.push(prefix + '.oscillator must be one of ' + JSON.stringify(oscillators));
    }
  }

  if (errors.length) {
    errors.forEach(e => console.log(e));
    return false;
  }

  return true;
};
