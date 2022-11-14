/** @type {HTMLCanvasElement} */
import { canvas, ctx, game } from "./app.js";

const animate = (timeStamp) => {
  if (!game.pause) {
    game.checkGameWinner();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
  }
  requestAnimationFrame(animate);
};

animate(0);

window.addEventListener("resize", (e) => {
  game.canvasPosition = canvas.getBoundingClientRect();
  game.ui.cssPosition();
});
