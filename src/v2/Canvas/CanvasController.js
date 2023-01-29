/* eslint-disable promise/prefer-await-to-callbacks */
/* eslint-disable no-await-in-loop */
import delay from '../../utils/delay';

const FPS = 30;
const DRAW_DELAY = 1000 / FPS;

class CanvasController {
  canvasId;
  canvas;

  lastDraw;

  onMousedownCallback;
  onMouseupCallback;
  onMouseenterCallback;
  onMouseleaveCallback;
  onMousemoveCallback;

  constructor(canvasId = 'canvas') {
    this.canvasId = canvasId;
    this.lastDraw = 0;
  }

  initialize = async () => {
    console.debug(
      `🔄 Initializing canvas, searching for canvas with id "${this.canvasId}"`,
    );
    let foundCanvas = false;
    while (!foundCanvas) {
      const canvas = document.getElementById(this.canvasId);

      if (canvas) {
        foundCanvas = true;
        canvas.width = this.gifWidth;
        canvas.height = this.gifHeight;
        this.context = canvas.getContext('2d');
        this.canvas = canvas;
        this.handleResize();
      } else {
        await delay(50);
      }
    }
    console.debug(`✅ Initialized canvas with id "${this.canvasId}"`);

    window.addEventListener('resize', this.handleResize);

    this.draw();
  };

  cleanup = () => {
    window.removeEventListener('resize', this.handleResize);
    this.canvas.removeEventListener('mousedown', this.onMousedownCallback);
    this.canvas.removeEventListener('mouseup', this.onMouseupCallback);
    this.canvas.removeEventListener('mouseenter', this.onMouseenterCallback);
    this.canvas.removeEventListener('mouseleave', this.onMouseleaveCallback);
    this.canvas.removeEventListener('mousemove', this.onMousemoveCallback);
  };

  handleResize = () => {
    const { width, height } = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = width;
    this.canvas.height = height;
  };

  onMousedown = (callback) => {
    if (typeof callback === 'function') {
      this.onMousedownCallback = callback;
      this.canvas.addEventListener('mousedown', this.onMousedownCallback);
    }
  };

  onMouseup = (callback) => {
    if (typeof callback === 'function') {
      this.onMouseupCallback = callback;
      this.canvas.addEventListener('mouseup', this.onMouseupCallback);
    }
  };

  onMouseenter = (callback) => {
    if (typeof callback === 'function') {
      this.onMouseenterCallback = callback;
      this.canvas.addEventListener('mouseenter', this.onMouseenterCallback);
    }
  };

  onMouseleave = (callback) => {
    if (typeof callback === 'function') {
      this.onMouseleaveCallback = callback;
      this.canvas.addEventListener('mouseleave', this.onMouseleaveCallback);
    }
  };

  onMousemove = (callback) => {
    if (typeof callback === 'function') {
      this.onMousemoveCallback = callback;
      this.canvas.addEventListener('mousemove', this.onMousemoveCallback);
    }
  };

  draw = () => {
    const now = Date.now();
    if (now > this.lastDraw + DRAW_DELAY) {
      // Draw here
      this.lastDraw = now;
    }
    requestAnimationFrame(() => {
      this.draw();
    });
  };
}

export default CanvasController;
