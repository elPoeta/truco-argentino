import {
  LOG_TEXT_X,
  LOG_TEXT_Y_BOTTOM,
  LOG_TEXT_Y_TOP,
} from "../utils/helpers.js";

export class LogMessage {
  constructor({ game }) {
    this.game = game;
    this.human = "";
    this.ia = "";
  }

  draw(ctx) {
    ctx.font = "50px Bangers";
    ctx.fillStyle = "#f59e0b";
    ctx.textAlign = "center";
    ctx.fillText(this.ia, LOG_TEXT_X, LOG_TEXT_Y_TOP);
    ctx.fillText(this.human, LOG_TEXT_X, LOG_TEXT_Y_BOTTOM);
  }
}
