/** @type {HTMLCanvasElement} */
import { canvas, ctx, game } from "./app.js";

Array.prototype.getLast = function () {
  if (this.length > 0) {
    return this[this.length - 1];
  } else {
    return undefined;
  }
};

const animate = (timeStamp) => {
  game.checkGameWinner();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.update();
  game.draw(ctx);
  requestAnimationFrame(animate);
};

animate(0);

window.addEventListener("resize", (e) => {
  game.canvasPosition = canvas.getBoundingClientRect();
  game.ui.cssPosition();
});
