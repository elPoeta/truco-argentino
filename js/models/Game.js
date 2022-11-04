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
import { LogMessage } from "./LogMessage.js";
import { Round } from "./Round.js";
import { Score } from "./Score.js";
import { UI } from "./UI.js";

const randomHand = generateRandomInteger(100) < 50;
export class Game {
  constructor({ canvasWidth, canvasHeight, canvasPosition }) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.canvasPosition = canvasPosition;
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
    this.ui = new UI({ game: this });
    this.humanScore = [
      new Score({ game: this, player: this.humanPlayer, maxScore: 5 }),
      new Score({ game: this, player: this.humanPlayer, maxScore: 10 }),
      new Score({ game: this, player: this.humanPlayer, maxScore: 15 }),
      new Score({ game: this, player: this.humanPlayer, maxScore: 20 }),
      new Score({ game: this, player: this.humanPlayer, maxScore: 25 }),
      new Score({ game: this, player: this.humanPlayer, maxScore: 30 }),
    ];
    this.IAScore = [
      new Score({ game: this, player: this.IAPlayer, maxScore: 5 }),
      new Score({ game: this, player: this.IAPlayer, maxScore: 10 }),
      new Score({ game: this, player: this.IAPlayer, maxScore: 15 }),
      new Score({ game: this, player: this.IAPlayer, maxScore: 20 }),
      new Score({ game: this, player: this.IAPlayer, maxScore: 25 }),
      new Score({ game: this, player: this.IAPlayer, maxScore: 30 }),
    ];
    this.logMessage = new LogMessage({ game: this });
    this.eventHandler = new EventHandler({ game: this });
    this.scoreLimit = 30;
    this.round = new Round({ game: this });
    this.round.start();
  }

  update() {}

  draw(ctx) {
    this.drawDahedArea(ctx);
    this.renderScoreTable(ctx);
    [
      ...[this.humanPlayer, this.IAPlayer],
      ...[this.logMessage],
      ...this.humanScore,
      ...this.IAScore,
    ].forEach((element) => element.draw(ctx));
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

  renderScoreTable(ctx) {
    const maxLine = this.scoreLimit > 15 ? 500 : 275;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(1415, 5);
    ctx.lineTo(1415, maxLine);
    ctx.stroke();
    if (this.scoreLimit > 15) {
      ctx.beginPath();
      ctx.moveTo(1275, 271.5);
      ctx.lineTo(1550, 271.5);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(1275, 40);
    ctx.lineTo(1550, 40);
    ctx.stroke();

    ctx.font = "20px Bangers";
    ctx.fillStyle = "#f59e0b";
    ctx.textAlign = "center";
    ctx.fillText(
      `${this.humanPlayer.name} ( ${this.humanPlayer.score} )`,
      1350,
      30
    );
    ctx.fillText(`${this.IAPlayer.name} ( ${this.IAPlayer.score} )`, 1475, 30);
  }
}
