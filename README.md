# pngsound

Generate wav files from an input png image file.

Docs still in progress - to generate the sample output just run `node src/parallel.js` - this is currently hardcoded to read `sample/control.js`

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
| `changeRatio` | `float` || If you have an input image that is 20 pixels wide, for example, and have the `duration` set to 60 (seconds), then each pixel will 'play' for 3 seconds before moving to the next. When moving from one pixel to the next, this changeRatio represents how much of this pixel time will be used to _slide_ to the next set of values. For example if set to 0, the frequency of the oscillator would _immediately_ change from its previous value to the next value. Whereas if this is set to 0.5, the oscillator would take 1.5s (in the example above) to slide to the next frequency.
| `offsetRatio` | `float` || Each row/oscillator can have an offset from the previous row in when they change values. This value represents the ratio of the 'pixel duration' before the _last_ row changes (intermediate rows will be scaled between 0 and this value). If you have an input image that is 20 pixels wide and 5 pixels high, for example, and have the `duration` set to 40 (seconds) with an `offsetRatio` of 0, then each oscillator changes at the same time (every 2 seconds). If you have an offsetRatio of 0.5, then the second row would change 0.25 seconds after the first, the third row 0.5 seconds after the first, the fourth 0.75s after the first, and the fifth oscillator would change 1 second after the change to the first row. |
| `oscillator` | `string` or `function` || Either one of `sawtooth`, `sine`, `square`, `triangle` or a function that returns one of those strings. The object passed to the function is described below. |
| `post` | `array` || An array of functions to apply to the sound after it has completed generation |

### oscillator controlling attributes

There are six attributes for each oscillator `amplitude`, `frequency`, `lowPassCutoff`, `lowPassResonance`, `stereoPosition`and `timbre` that take similar values; and are set from attributes of pixel colours.

| name | type | default | notes |
| ---- | ---- | ------- | ----- |
| `[attribute]` | `string` or `number` or `function` || If this is a string it should be one of `h` (hue), `s` (saturation), `v` (value), `r` (red), `g` (green), `b` (blue), `x` (column ratioed from 0-1), `y` (row ratioed from 0-1). Also, if a string the `[attribute]Min` and `[attribute]Max` values need to be provided \ OR \ If this is a number then the constant value will be used. In this case `[attribute]Min` and `[attribute]Max` are unnecessary \ OR \ If this is a function, the value returned by the function is used. In this case `[attribute]Min` and `[attribute]Max` are unnecessary. The object passed to the function is described below. |
| `[attribute]Min` | `number` || The value to use when the attribute value is 0 |
| `[attribute]Max` | `number` || The value to use when the attribute value is 1 |
| `[attribute]ChangeRatio` | `number` || Like the global `changeRatio` value, but for a specific part of the oscillator control |
