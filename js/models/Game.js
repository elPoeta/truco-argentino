import { Card } from "./Card.js";
export class Game {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.scale = 0.8;
    this.cards = [new Card(this, 10, 10, 0, 0)];
  }

  update() {
    [...this.cards].forEach((card) => card.update());
  }

  draw(ctx) {
    [...this.cards].forEach((card) => card.draw(ctx));
  }
}
