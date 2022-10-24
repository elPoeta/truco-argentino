/** @type {HTMLCanvasElement} */
import { canvas, ctx, deckImage } from "./app.js";

const animate = (timeStamp) => {
  const originalWidth = deckImage.width;
  const originalHeight = deckImage.height;
  const frameX = 0;
  const frameY = 0;
  const deckW = originalWidth / 12;
  const deckH = originalHeight / 5;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(boardImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    deckImage,
    frameX * deckW,
    frameY * deckH,
    deckW,
    deckH,
    10,
    10,
    deckW,
    deckH
  );
  ctx.drawImage(
    deckImage,
    1 * deckW,
    0 * deckH,
    deckW,
    deckH,
    deckW + 50,
    10,
    deckW,
    deckH
  );
  requestAnimationFrame(animate);
};

animate(0);
