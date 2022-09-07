class GifFramesController {
  canvas;
  context;
  frames = [];
  currentFrameIdx = 0;

  constructor(gif, frames) {
    this.frames = frames;
    this.gifWidth = gif.lsd.width;
    this.gifHeight = gif.lsd.height;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.gifWidth;
    this.canvas.height = this.gifHeight;
    this.context = this.canvas.getContext('2d');
  }

  async getNextFrameData() {
    if (this.currentFrameIdx === this.frames.length - 1) {
      return null;
    }

    const frame = this.frames[this.currentFrameIdx];
    const {
      disposalType,
      patch,
      dims: { left, top, width, height },
    } = frame;
    console.debug(`🖌 Drawing GIF frame ${this.currentFrameIdx}`, frame);

    if (disposalType === 2) {
      this.context.clearRect(0, 0, width, height);
    }

    const imageData = new ImageData(patch, width, height);
    const imageBitmap = await createImageBitmap(imageData);
    this.context.drawImage(imageBitmap, left, top, width, height);
    const frameImageData = this.context.getImageData(
      0,
      0,
      this.gifWidth,
      this.gifHeight,
    );

    this.currentFrameIdx += 1;
    return {
      data: frameImageData.data,
      width: frameImageData.width,
      height: frameImageData.height,
    };
  }
}

export default GifFramesController;
