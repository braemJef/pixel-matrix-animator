# Pixel Matrix Animator

As the title says this is a "pixel matrix animator". This is a tool for creating simple animations for LED matrixes which use LEDs like the WS2812B. A working demo version can be found on [pixel-matrix-animator.herokuapp.com](https://pixel-matrix-animator.herokuapp.com/)

## How does it work?

You can surf to the demo website and create some frames. To save your progress there is a save button which downloads the complete state as json. You can upload your progress again by choosing this json file with the open button.

To show the animation you will need to export your animation as a binary and copy this to your microcontroller.

An arduino example can be found in this repository [disco-floor](https://github.com/braemJef/disco-floor)

## Binary file format

The binary file which is exported will have the following content:

### 16 bytes Animation config

At the start of each binary file there will first be a general configuration.

- `byte 1` The animation mode which was selected.

  | mode    | byte value |
  | ------- | ---------- |
  | fade    | 0x00       |
  | retain  | 0x01       |
  | replace | 0x02       |
  
- `byte 2` The fps rate of the animation

  The byte should be converted to an unsigned integer
  
- `byte 3-4` Amount of frames that the animation contains

  These 2 bytes should be converted to an unsigned integer
  
- `byte 5` Amount that the fade mode should fade if chosen

  The byte should be converted to an unsigned integer

- `byte 6-16` Unused bytes

### 8 bytes Frame config

For each frame in the binary the following bytes will be present.

- `byte 1-2` Amount of pixels that the frame contains

  These 2 bytes should be converted to an unsigned integer

- `byte 3-8` Unused bytes


### 5 bytes Pixel config

For each pixel in the frame the following bytes will be present.

- `byte 1` The x position of the pixel.
- `byte 2` The y position of the pixel.
- `byte 3` The red color value of the pixel.
- `byte 4` The green color value of the pixel.
- `byte 5` The blue color value of the pixel.

## Development

The project is created using React + Vite and uses yarn for package management.

- Start development `yarn dev`
- Make build `yarn build`
- Lint files `yarn lint`
