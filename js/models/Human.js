import { playedCardCoords } from "../utils/gameHelper.js";
import { Player } from "./Player.js";

export class Human extends Player {
  constructor({ game, name, itIsHand, hisTurn }) {
    super({ game, name, itIsHand, hisTurn });
  }

  playCard(index) {
    if (
      index === null ||
      index === undefined ||
      index < 0 ||
      !this.cardsInHand.length
    )
      return;
    const card = this.cardsInHand[index];
    const len = this.playedCards.length + this.game.IAPlayer.playedCards.length;
    const { x, y } = playedCardCoords[len];
    card.x = x;
    card.y = y;
    this.playedCards.push(card);
    this.cardsInHand.splice(index, 1);
    return card;
  }

  removeAllCards() {
    this.cards = [];
    this.cardsInHand = [];
    this.playedCards = [];
  }
}
