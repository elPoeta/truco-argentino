import { playedCardCoords } from "../utils/gameHelper.js";
import { Player } from "./Player.js";

export class Human extends Player {
  constructor({ game }) {
    super({ game });
  }
  setInitialValues({ name, itIsHand, hisTurn }) {
    this.baseValues();
    this.name = name;
    this.itIsHand = itIsHand;
    this.hisTurn = hisTurn;
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
    card.renderOrder = len;
    this.playedCards.push(card);
    this.game.playedCards.push(card);
    this.cards = this.cards.map((c) => {
      if (c.number === card.number && c.suit === card.suit) {
        c.played = true;
      }
      return c;
    });
    this.cardsInHand.splice(index, 1);
    this.game.round.humanPlayCard();
  }

  removeAllCards() {
    this.cards = [];
    this.cardsInHand = [];
    this.playedCards = [];
  }
}
