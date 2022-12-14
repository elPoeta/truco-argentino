import { MAX_FRAME_X, MAX_FRAME_y } from "../utils/helpers.js";
import { Deck } from "./Deck.js";
import { Human } from "./Human.js";
export class Card {
  constructor({
    game,
    x,
    y,
    frameX,
    frameY,
    cardValue,
    cardNumber,
    cardSuit,
    envidoPoints,
  }) {
    this.game = game;
    this.scale = this.game.scale;
    this.image = deckImg;
    this.originalWidth = this.image.width;
    this.originalHeight = this.image.height;
    this.spriteWidth = this.originalWidth / MAX_FRAME_X;
    this.spriteHeight = this.originalHeight / MAX_FRAME_y;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.x = x || 0;
    this.y = y || 0;
    this.frameX = frameX;
    this.frameY = frameY;
    this.isGrabbed = false;

    this.value = cardValue || 0;
    this.envidoPoints = envidoPoints || 0;
    this.number = cardNumber || 0;
    this.suit = cardSuit || "";
    this.played = false;
    this.renderOrder = 0;
  }

  getName() {
    return `${this.number} de ${this.suit}`;
  }

  update({ x, y }) {
    this.x = x;
    this.y = y;
  }

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

  isTouching(x, y) {
    if (
      this.x < x &&
      x < this.x + this.width * this.scale &&
      this.y < y &&
      y < this.y + this.height * this.scale
    ) {
      return true;
    } else {
      return false;
    }
  }

  isColliding(o) {
    if (this.x < o.x + o.w && o.x < this.x + this.width) {
      if (this.y < o.y + o.h && o.y < this.y + this.height) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  winnerProbability() {
    const deck = new Deck({ game: this.game });
    const cards = deck.generate();
    let deckLength = cards.length;
    cards.forEach((card) => {
      if (
        card.value >= this.value &&
        !(card.suit === this.suit && card.number === this.number)
      )
        deckLength--;
    });

    return deckLength / cards.length;
  }
}
