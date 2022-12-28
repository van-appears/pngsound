const { SAMPLE_RATE } = require("./constants");
module.exports = seconds => Math.floor(seconds * SAMPLE_RATE);
