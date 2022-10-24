import { downScaleImage } from "./utils/scaleImage.js";

const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.ImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;

const deckImage = downScaleImage(deckImg, 0.5);

export { canvas, ctx, deckImage };
