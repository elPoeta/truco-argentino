import { SCALE } from "../utils/helpers.js";
import { Human } from "./Human.js";
import { IA } from "./IA.js";
export class Game {
  constructor({ canvasWidth, canvasHeight }) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.scale = SCALE;
    this.players = [
      new IA({ game: this, name: "elPoeta" }),
      new Human({ game: this, name: "Player 1" }),
    ];
  }

  update() {
    [...this.players].forEach((player) => player.update());
  }

  draw(ctx) {
    [...this.players].forEach((player) => player.draw(ctx));
  }
}
