# pngsound

Generate wav files from an input png image file.

## running

To generate the sample output just run `node src/parallel.js` - this is currently hardcoded to read `sample/control.js`

## control

This program reads a png image and effectively uses it as a score, where a row in the image is used to control an individual oscillator. While generating the output file the program successively reads each pixel in the row and uses attributes of that pixel (e.g. hue, saturation, value, red, green, blue) to map to frequency, amplitude, stereo position etc.  How the rows and pixels are mapped to the values is defined in a js file with a number of properties.

### track controlling attributes

| name | type | default | notes |
| ---- | ---- | ------- | ----- |
| `inputFile` | `string` || The image .png file to read |
| `outputFile` | `string` || The .wav file to create |
| `rows` | `integer` | height of the image | The number of rows of image to use; this will be the number of oscillators to use |
| `startRow` | `integer` | `0` | The image row to start at (0 is the top of the image) |
| `wrap` | `boolean` | `false` | If the number of rows used is less than the image height, this will chop the image into multiple blocks of rows until it gets to the end of the mage |
| `duration` | `float` || The length (in seconds) of the .wav to create |
| `changeRatio` | `float` | 0.666 | If you have an input image that is 20 pixels wide, for example, and have the `duration` set to 60 (seconds), then each pixel will 'play' for 3 seconds before moving to the next. When moving from one pixel to the next, this changeRatio represents how much of this pixel time will be used to _slide_ to the next set of values. For example if set to 0, the frequency of the oscillator would _immediately_ change from its previous value to the next value. Whereas if this is set to 0.5, the oscillator would take 1.5s (in the example above) to slide to the next frequency.
| `offsetRatio` | `float` || Each row/oscillator can have an offset from the previous row in when they change values. This value represents the ratio of the 'pixel duration' before the _last_ row changes (intermediate rows will be scaled between 0 and this value). If you have an input image that is 20 pixels wide and 5 pixels high, for example, and have the `duration` set to 40 (seconds) with an `offsetRatio` of 0, then each oscillator changes at the same time (every 2 seconds). If you have an offsetRatio of 0.5, then the second row would change 0.25 seconds after the first, the third row 0.5 seconds after the first, the fourth 0.75s after the first, and the fifth oscillator would change 1 second after the change to the first row. |
| `oscillator` | `string` or `function` | `sine` | Either one of `sawtooth`, `sine`, `square`, `triangle` or a function that returns one of those strings. The object passed to the function is described below. |
| `post` | `array` || An array of functions to apply to the sound after it has completed generation |

### oscillator controlling attributes

There are six attributes for each oscillator `amplitude`, `frequency`, `lowPassCutoff`, `lowPassResonance`, `stereoPosition`and `timbre` that take similar values; and are set from attributes of pixel colours.

| name | type | default | notes |
| ---- | ---- | ------- | ----- |
| `[attribute]` | `string` or `number` or `function` || If this is a string it should be one of `h` (hue), `s` (saturation), `v` (value), `r` (red), `g` (green) or `b` (blue). Also, if a string the `[attribute]Min` and `[attribute]Max` values need to be provided<br/>OR<br/>If this is a number then the constant value will be used. In this case `[attribute]Min` and `[attribute]Max` are unnecessary<br/>OR<br/>If this is a function, the value returned by the function is used. In this case `[attribute]Min` and `[attribute]Max` are unnecessary. The object passed to the function is described below. |
| `[attribute]Min` | `number` || The value to use when the attribute value is 0 |
| `[attribute]Max` | `number` || The value to use when the attribute value is 1 |
| `[attribute]ChangeRatio` | `number` || Like the global `changeRatio` value, but for a specific part of the oscillator control |
| `[attribute]Scale` | `string` || Whether the scale from the min to max should be linear or curved. `frequencyScale` and `lowPassCutoffScale` default to `exponential`, the others default to `linear` |

A note on the `stereoPosition` attribute - a value of 0.5 represents stereo centre. This is the only oscillator control with a default value.

The attributes `lowPassCutoff` and `lowPassResonance` are optional; if not provided then no filter is applied. The filter is also not applied is the oscillator is `sine`.

### function controlled attributes

If a function is defined for an attribute it will be passed an object `obj` containing the attributes of the current pixel

| attribute | notes |
| --------- | ----- |
| `obj.r`       | scaled 'red' value, from 0 to 1 |
| `obj.raw.r`   | unscaled 'red' value, from 0 to 255 |
| `obj.g`       | scaled 'green' value, from 0 to 1 |
| `obj.raw.g`   | unscaled 'green' value, from 0 to 255 |
| `obj.b`       | scaled 'blue' value, from 0 to 1 |
| `obj.raw.b`   | unscaled 'blue' value, from 0 to 255 |
| `obj.h`       | scaled 'hue' value, from 0 to 1 |
| `obj.raw.h`   | unscaled 'hue' value, from 0 to 360 |
| `obj.s`       | scaled 'saturation' value, from 0 to 1 |
| `obj.raw.s`   | unscaled 'saturation' value, from 0 to 100 |
| `obj.v`       | scaled 'value' value, from 0 to 1 |
| `obj.raw.v`   | unscaled 'value' value, from 0 to 255 |
| `obj.row`     | scaled row value, from 0 to 1 |
| `obj.raw.row` | unscaled row value. This is the row within the _slice_ i.e. the row at `startRow` is row 0 |
| `obj.raw.rows` | the same value as the `rows` from the control attributes |
| `obj.col` | scaled column value, from 0 to 1
| `obj.raw.col` | unscaled column value. This is the column within the _slice_, so if wrap is enable it will go from 0 to the width * number of wraps |
| `obj.raw.cols` | The total width * number of wraps |
| `obj.raw.x` | The actual pixel 'x' position value |
| `obj.raw.y` | The actual pixel 'y' position value |

Examples:
```
frequency: function(obj) {
  // use the 'raw' red value (from 0-255) as the frequency
  return obj.raw.r;
}
```

```
oscillator: function(obj) {
  // use the hue to choose the oscillator type
  return ["square", "sawtooth", "triangle", "sine"][Math.floor(4 * obj.h)];
}
```
