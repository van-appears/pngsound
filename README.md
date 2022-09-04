# pngsound

Generate wav files from an input png image file.

## control

This program reads a png image and effectively uses it as a score, where a row in the image is used to control an individual oscillator. While generating the output file the program successively reads each pixel in the row and uses attributes of that pixel (e.g. hue, saturation, value, red, green, blue) to map to frequency, amplitude, stereo position etc.  How the rows and pixels are mapped to the values is defined in a js file with a number of properties.

| name | type | default | notes |
| ---- | ---- | ------- | ----- |
| `inputFile` | `string` || The image .png file to read |
| `outputFile` | `string` || The .wav file to create |
| `rows` | `integer` | height of the image | The number of rows of image to use; this will be the number of oscillators to use |
| `startRow` | `integer` | `0` | The image row to start at (0 is the top of the image) |
| `wrap` | `boolean` | `false` | If the number of rows used is less than the image height, this will chop the image into multiple blocks of rows |
| `duration` | `float` || The length (in seconds) of the .wav to create |
| `changeRatio` | `float` || If you have an input image that is 20 pixels wide, for example, and have the `duration` set to 60 (seconds), then each pixel will 'play' for 3 seconds before moving to the next. When moving from one pixel to the next, this changeRatio represents how much of this pixel time will be used to _slide_ to the next set of values. For example if set to 0, the frequency of the oscillator would _immediately_ change from its previous value to the next value. Whereas if this is set to 0.5, the oscillator would take 1.5s (in the example above) to slide to the next frequency. (NB, this property applies to _all_ oscillator attributes: `frequency`, `amplitude`, `stereoPosition`, `lowPassCutoff`, `lowPassResonance`, they do not have individual changeRatios)
| `offsetRatio` | `float` || Each row/oscillator can have an offset from the previous row in when they change values. This value represents the ratio of the 'pixel duration' before the _last_ row changes (intermediate rows will be scaled between 0 and this value). If you have an input image that is 20 pixels wide and 5 pixels high, for example, and have the `duration` set to 40 (seconds) with an `offsetRatio` of 0, then each oscillator changes at the same time (every 2 seconds). If you have an offsetRatio of 0.5, then the second row would change 0.25 seconds after the first, the third row 0.5 seconds after the first, the fourth 0.75s after the first, and the fifth oscillator would change 1 second after the change to the first row. |





TODO allow different frequency range for low pass
TODO allow 'shifting' oscillator (equivalent to changeRatio)
TODO allow changeRatios per sound attribute?
TODO allow changeRatios to be function controlled rather than constant?
TODO allow multiple workers
TODO docs
