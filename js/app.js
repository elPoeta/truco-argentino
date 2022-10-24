import { downScaleImage } from "./utils/scaleImage.js";

const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.ImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;

const deckImage = downScaleImage(deckImg, 0.3);

export { canvas, ctx, deckImage };

// function roundedImage(x, y, width, height, radius) {
//   ctx.beginPath();
//   ctx.moveTo(x + radius, y);
//   ctx.lineTo(x + width - radius, y);
//   ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//   ctx.lineTo(x + width, y + height - radius);
//   ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//   ctx.lineTo(x + radius, y + height);
//   ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//   ctx.lineTo(x, y + radius);
//   ctx.quadraticCurveTo(x, y, x + radius, y);
//   ctx.closePath();
// }

// ctx.save();
//   roundedImage(10, 10, deckW, deckH, 20);
//   ctx.clip();
//   ctx.drawImage(
//     deckImage,
//     frameX * deckW,
//     frameY * deckH,
//     deckW,
//     deckH,
//     10,
//     10,
//     deckW,
//     deckH
//   );
//   ctx.restore();
//   ctx.save();
//   roundedImage(deckW + 50, 10, deckW, deckH, 20);
//   ctx.clip();
//   ctx.drawImage(
//     deckImage,
//     1 * deckW,
//     0 * deckH,
//     deckW,
//     deckH,
//     deckW + 50,
//     10,
//     deckW,
//     deckH
//   );
//   ctx.restore();
