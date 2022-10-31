import { EventHandler } from "../controllers/EventHandler.js";
import { generateRandomInteger } from "../utils/gameHelper.js";
import {
  PLAYED_AREA_H,
  PLAYED_AREA_W,
  PLAYED_AREA_X,
  PLAYED_AREA_Y,
  SCALE,
} from "../utils/helpers.js";

import { Human } from "./Human.js";
import { IA } from "./IA.js";
import { Round } from "./Round.js";

const randomHand = generateRandomInteger(100) < 50;
export class Game {
  constructor({ canvasWidth, canvasHeight }) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.scale = SCALE;
    this.renderDashedArea = false;
    this.humanPlayer = new Human({
      game: this,
      name: "Player 1",
      itIsHand: randomHand,
      hisTurn: !randomHand,
    });
    this.IAPlayer = new IA({
      game: this,
      name: "elPoeta",
      itIsHand: !randomHand,
      hisTurn: randomHand,
    });
    this.eventHandler = new EventHandler({ game: this });
    this.scoreLimit = 30;
    this.round = new Round({ game: this });
    this.round.start();
  }

  update() {
    //  [...this.players].forEach((player) => player.update());
  }

  draw(ctx) {
    this.drawDahedArea(ctx);
    [...[this.humanPlayer, this.IAPlayer]].forEach((player) =>
      player.draw(ctx)
    );
  }

  drawDahedArea(ctx) {
    if (!this.renderDashedArea) return;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([6]);
    ctx.lineWidth = "4";
    ctx.strokeStyle = "#ca8a04";
    ctx.rect(PLAYED_AREA_X, PLAYED_AREA_Y, PLAYED_AREA_W, PLAYED_AREA_H);
    ctx.stroke();
    ctx.restore();
  }
}
