import { Game } from "./models/Game.js";
import { Menu } from "./models/Menu.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/helpers.js";
const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.ImageSmoothingEnabled = false;

const canvasPosition = canvas.getBoundingClientRect();

const game = new Game({
  canvasWidth: canvas.width,
  canvasHeight: canvas.height,
  canvasPosition: canvasPosition,
});

const menu = new Menu({ game });
menu.render();

export { canvas, ctx, game, menu };
