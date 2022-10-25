import { isMobile } from "../utils/helpers.js";

export class Game {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.scale = isMobile ? 0.3 : 0.6;
    this.boardImage = boardImg;
  }

  update() {}

  draw(ctx) {}

  renderBoard(ctx) {
    ctx.drawImage(this.boardImage, 0, 0, this.canvasWidth, this.canvasHeight);
  }
}
