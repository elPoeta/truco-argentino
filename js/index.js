/** @type {HTMLCanvasElement} */
import { canvas, ctx } from "./app.js";
const animate = timeStamp => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(boardImg, 0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);

}

animate(0);
