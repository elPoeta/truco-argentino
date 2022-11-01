/** @type {HTMLCanvasElement} */
import { canvas, ctx, game } from "./app.js";

const animate = (timeStamp) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ctx.font = "150px Bangers";
  // ctx.fillStyle = "#ca8a04";
  // ctx.textAlign = "center";
  // ctx.fillText("Truco", canvas.width / 2, canvas.height / 2);
  // ctx.strokeText("Truco", canvas.width / 2, canvas.height / 2);

  game.update();
  game.draw(ctx);
  requestAnimationFrame(animate);
};

animate(0);

window.addEventListener("resize", (e) => {
  const { top, left } = canvas.getBoundingClientRect();
  game.ui.panel.style.left = `${left + 10}px`;
  game.ui.panel.style.bottom = `${top + 10}px`;
});
