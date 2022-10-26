import { Game } from "./models/Game.js";
const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");

canvas.width = 1600;
canvas.height = 900;

ctx.ImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;

//const deckImage = downScaleImage(deckImg, 0.3);
const game = new Game(canvas.width, canvas.height);

export { canvas, ctx, game };
