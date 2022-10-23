/** @type {HTMLCanvasElement} */
import { canvas, ctx } from "./app.js";

const animate = (timeStamp) => {
  const originalWidth = deckImg.width;
  const originalHeight = deckImg.height;
  const frameX = 0;
  const frameY = 0;
  const deckW = originalWidth / 12;
  const deckH = originalHeight / 5;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(boardImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    deckImg,
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
    deckImg,
    2 * deckW,
    2 * deckH,
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
