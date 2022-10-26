/** @type {HTMLCanvasElement} */
import { canvas, ctx, game } from "./app.js";

const animate = (timeStamp) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.update();
  game.draw(ctx);
  requestAnimationFrame(animate);
};

animate(0);
