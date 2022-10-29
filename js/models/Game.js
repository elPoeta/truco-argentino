import { EventHandler } from "../controllers/EventHandler.js";
import {
  PLAYED_AREA_H,
  PLAYED_AREA_W,
  PLAYED_AREA_X,
  PLAYED_AREA_Y,
  SCALE,
} from "../utils/helpers.js";

import { Human } from "./Human.js";
import { IA } from "./IA.js";
export class Game {
  constructor({ canvasWidth, canvasHeight }) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.scale = SCALE;
    this.renderDashedArea = false;
    this.players = [
      new IA({ game: this, name: "elPoeta" }),
      new Human({ game: this, name: "Player 1" }),
    ];
    this.eventHandler = new EventHandler({ game: this });
  }

  update() {
    //  [...this.players].forEach((player) => player.update());
  }

  draw(ctx) {
    this.drawDahedArea(ctx);
    [...this.players].forEach((player) => player.draw(ctx));
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
