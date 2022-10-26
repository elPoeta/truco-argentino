import { SCALE } from "../utils/helpers.js";
import { IA } from "./IA.js";
export class Game {
  constructor({ canvasWidth, canvasHeight }) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.scale = SCALE;
    this.players = [new IA({ game: this, name: "elPoeta" })];
  }

  update() {
    [...this.players].forEach((player) => player.update());
  }

  draw(ctx) {
    [...this.players].forEach((player) => player.draw(ctx));
  }
}
