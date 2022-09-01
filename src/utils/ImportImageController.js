import Pica from 'pica';

const pica = new Pica();

class ImportImageController {
  canvas;
  context;
  rows = 0;
  columns = 0;
  mouseDown = false;
  startX = -1;
  startY = -1;
  distanceX = 0;
  distanceY = 0;
  imageLocationX = 0;
  imageLocationY = 0;
  imageSizeX = 0;
  imageSizeY = 0;
  imageData;
  data;
  imageBitmap;
  rotatedImageBitmap;
  rotation = 0;
  filter = 'lanczos2';

  constructor(data, width, height, rows, columns) {
    if (!data || !width || !height || !rows || !columns) {
      return;
    }
    const imageData = new ImageData(data, width, height);

    this.imageData = imageData;
    this.data = data;
    this.imageSizeX = width;
    this.imageSizeY = height;
    this.rows = rows;
    this.columns = columns;
  }

  async initialize() {
    console.log('🚀 Initialize canvas with id "gifCanvas"');
    this.canvas = document.getElementById('gifCanvas');
    this.context = this.canvas.getContext('2d');
    this.imageBitmap = await createImageBitmap(this.imageData);
    this.rotatedImageBitmap = this.imageBitmap;
    console.log('finished rotating');
    window.requestAnimationFrame(() => {
      this.draw();
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.handleMouseDown(e);
    });
    this.canvas.addEventListener('mouseup', (e) => {
      this.handleMouseUp(e);
    });
    this.canvas.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e);
    });
    this.canvas.addEventListener('mouseout', (e) => {
      this.handleMouseOut(e);
    });
  }

  async setImageData(data, width, height) {
    const imageData = new ImageData(data, width, height);

    this.imageData = imageData;
    this.data = data;

    await this.resizeImage(this.imageSizeX, this.imageSizeY, this.filter);
  }

  getCurrentImage() {
    return this.context.getImageData(
      this.columns / 2,
      this.rows / 2,
      this.columns,
      this.rows,
    );
  }

  setImageLocationX(x) {
    this.imageLocationX = x;
  }

  setImageLocationY(y) {
    this.imageLocationY = y;
  }

  drawBackground() {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBorderRectangle() {
    this.context.strokeStyle = 'rgba(255,255,255,0.6)';
    this.context.fillStyle = 'rgba(255,255,255,0.6)';
    this.context.lineWidth = 1;
    this.context.fillRect(0, 0, this.columns * 2, this.rows / 2);
    this.context.fillRect(
      0,
      this.rows + this.rows / 2,
      this.columns * 2,
      this.rows / 2,
    );
    this.context.fillRect(0, this.rows / 2, this.columns / 2, this.rows);
    this.context.fillRect(
      this.columns + this.columns / 2,
      this.rows / 2,
      this.columns / 2,
      this.rows,
    );
  }

  draw() {
    // First draw background
    this.drawBackground();
    // Draw the gif
    this.context.drawImage(
      this.rotatedImageBitmap,
      this.imageLocationX,
      this.imageLocationY,
      this.imageSizeX,
      this.imageSizeY,
    );
    // Finally draw rectangle overlay
    this.drawBorderRectangle();

    // Re-draw
    window.requestAnimationFrame(() => {
      this.draw();
    });
  }

  moveImage() {
    let pixelsX;
    let pixelsY;

    if (this.distanceX > 0) {
      pixelsX = Math.floor(this.distanceX / 10);
    } else {
      pixelsX = Math.ceil(this.distanceX / 10);
    }
    if (this.distanceY > 0) {
      pixelsY = Math.floor(this.distanceY / 10);
    } else {
      pixelsY = Math.ceil(this.distanceY / 10);
    }

    if (pixelsX >= 1 || pixelsX <= -1) {
      this.imageLocationX -= pixelsX;
      this.distanceX = 0;
    }
    if (pixelsY >= 1 || pixelsY <= -1) {
      this.imageLocationY -= pixelsY;
      this.distanceY = 0;
    }
  }

  async resizeImage(toWidth, toHeight, filter) {
    console.log('🔎 Resizing image', { toWidth, toHeight, filter });
    const resized = await pica.resizeBuffer({
      src: this.data,
      width: this.imageData.width,
      height: this.imageData.height,
      toWidth,
      toHeight,
      filter,
    });
    const resizedImageData = new ImageData(
      Uint8ClampedArray.from(resized),
      toWidth,
      toHeight,
    );
    this.filter = filter;
    this.imageSizeX = toWidth;
    this.imageSizeY = toHeight;
    this.imageBitmap = await createImageBitmap(resizedImageData);
    await this.rotateImage();
  }

  async rotateImage() {
    console.log('🔄 Rotating image', {
      rotation: this.rotation,
      radians: (Math.PI / 2) * this.rotation,
      degrees: (Math.PI / 2) * this.rotation * (180 / Math.PI),
    });
    const inMemoryCanvas = document.createElement('canvas');
    const inMemoryContext = inMemoryCanvas.getContext('2d');
    inMemoryContext.translate(this.imageSizeX / 2, this.imageSizeY / 2);
    inMemoryContext.rotate((Math.PI / 2) * this.rotation);
    inMemoryContext.translate(-this.imageSizeX / 2, -this.imageSizeY / 2);
    inMemoryContext.drawImage(
      this.imageBitmap,
      0,
      0,
      this.imageSizeX,
      this.imageSizeY,
    );
    const imageData = inMemoryContext.getImageData(
      0,
      0,
      this.imageSizeX,
      this.imageSizeY,
    );
    this.rotatedImageBitmap = await createImageBitmap(imageData);
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    this.mouseDown = true;
    const { clientX, clientY } = event;
    this.startX = clientX;
    this.startY = clientY;
  }

  handleMouseUp(event) {
    event.preventDefault();
    event.stopPropagation();
    this.mouseDown = false;
    this.startX = -1;
    this.startY = -1;
  }

  handleMouseOut(event) {
    event.preventDefault();
    event.stopPropagation();
    this.mouseDown = false;
  }

  handleMouseMove(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.mouseDown || this.startX === -1 || this.startY === -1) {
      return;
    }
    const { clientX, clientY } = event;
    const deltaX = this.startX - clientX;
    const deltaY = this.startY - clientY;
    this.startX = clientX;
    this.startY = clientY;
    this.distanceX += deltaX;
    this.distanceY += deltaY;

    this.moveImage();
  }
}

export default ImportImageController;
