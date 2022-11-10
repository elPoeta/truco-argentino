import { SPRITE_SCORE_HEIGHT, SPRITE_SCORE_WIDTH } from "../utils/helpers.js";
import { Human } from "./Human.js";

export class Score {
  constructor({ game, player, maxScore }) {
    this.game = game;
    this.image = matchStickImg;
    this.spriteWidth = SPRITE_SCORE_WIDTH;
    this.spriteHeight = SPRITE_SCORE_HEIGHT;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.x = 0; //x || 0;
    this.y = 0; //y || 0;
    this.frameX = 0; //frameX;
    this.frameY = 0; //frameY;
    this.player = player;
    this.maxScore = maxScore;
  }

  draw(ctx) {
    if (this.player.score === 0) return;
    if (this.player.score <= this.maxScore) {
      this.updateCoords();
    } else {
      this.fixCoords();
    }
    ctx.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width * 0.2,
      this.height * 0.2
    );
  }

  updateCoords() {
    this.getSpriteXCoords();
    this.getSpriteYCoords();
  }

  fixCoords() {
    this.x = this.player instanceof Human ? 1300 : 1450;
    this.frameX = 4;
  }

  getSpriteXCoords() {
    this.x = this.player instanceof Human ? 1300 : 1450;
    const p = this.player.score % 5;
    switch (p) {
      case 0:
        this.frameX = 4;
        break;
      case 1:
        this.frameX = 0;
        break;
      case 2:
        this.frameX = 1;
        break;
      case 3:
        this.frameX = 2;
        break;
      case 4:
        this.frameX = 3;
        break;
    }
  }

  getSpriteYCoords() {
    switch (this.player.score) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        this.y = 50;
        break;
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        this.y = 125;
        break;
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        this.y = 200;
        break;
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
        this.y = 275;
        break;
      case 21:
      case 22:
      case 23:
      case 24:
      case 25:
        this.y = 350;
        break;
      case 26:
      case 27:
      case 28:
      case 29:
      case 30:
        this.y = 425;
        break;
    }
  }
}
