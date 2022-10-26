import { MAX_FRAME_X, MAX_FRAME_y } from "../utils/helpers.js";

export class Card {
  constructor({ game, x, y, frameX, frameY }) {
    this.game = game;
    this.scale = this.game.scale;
    this.image = deckImg;
    this.originalWidth = this.image.width;
    this.originalHeight = this.image.height;
    this.spriteWidth = this.originalWidth / MAX_FRAME_X;
    this.spriteHeight = this.originalHeight / MAX_FRAME_y;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.x = x;
    this.y = y;
    this.frameX = frameX;
    this.frameY = frameY;
  }

  update() {}

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width * this.scale,
      this.height * this.scale
    );
  }
}
