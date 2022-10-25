/** @type {HTMLCanvasElement} */
import { canvas, ctx, game } from "./app.js";

const animate = (timeStamp) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.renderBoard(ctx);
  // const scale = isMobile ? 0.3 : 0.6;
  // const originalWidth = deckImg.width;
  // const originalHeight = deckImg.height;
  // const frameX = 0;
  // const frameY = 0;
  // const deckW = originalWidth / 12;
  // const deckH = originalHeight / 5;
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.drawImage(boardImg, 0, 0, canvas.width, canvas.height);
  // ctx.drawImage(
  //   deckImg,
  //   frameX * deckW,
  //   frameY * deckH,
  //   deckW,
  //   deckH,
  //   10,
  //   10,
  //   deckW * scale,
  //   deckH * scale
  // );
  // ctx.drawImage(
  //   deckImg,
  //   1 * deckW,
  //   0 * deckH,
  //   deckW,
  //   deckH,
  //   deckW * scale + 50,
  //   10,
  //   deckW * scale,
  //   deckH * scale
  // );
  requestAnimationFrame(animate);
};

animate(0);
