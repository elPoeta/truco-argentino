import { isMobile } from "../utils/helpers.js";
import { Card } from "./Card.js";
export class Game {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.scale = isMobile ? 0.4 : 0.6;
    this.boardImage = boardImg;
    this.cards = [new Card(this, 10, 10, 0, 0)];
  }

  update() {
    [...this.cards].forEach((card) => card.update());
  }

  draw(ctx) {
    [...this.cards].forEach((card) => card.draw(ctx));
  }

  renderBoard(ctx) {
    ctx.drawImage(this.boardImage, 0, 0, this.canvasWidth, this.canvasHeight);
  }
}
