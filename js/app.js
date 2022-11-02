import { Game } from "./models/Game.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/helpers.js";
const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.ImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;

const canvasPosition = canvas.getBoundingClientRect();

const game = new Game({
  canvasWidth: canvas.width,
  canvasHeight: canvas.height,
  canvasPosition: canvasPosition,
});

export { canvas, ctx, game };
