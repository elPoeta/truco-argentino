import {
  POS_CARD_1,
  POS_CARD_2,
  POS_CARD_3,
  TOP_CARD_Y,
} from "../utils/helpers.js";
import { Card } from "./Card.js";
import { Player } from "./Player.js";
import { Probability } from "./Probability.js";

export class IA extends Player {
  constructor({ game, name, itIsHand, hisTurn }) {
    super({ game, name, itIsHand, hisTurn });
    this.cardsInHand = this.setCardsInHand();
    this.strategyGame = null;
    this.probability = new Probability({ game });
  }

  setCardsInHand() {
    return [
      new Card({
        game: this.game,
        x: POS_CARD_1,
        y: TOP_CARD_Y,
        frameX: 1,
        frameY: 4,
      }),
      new Card({
        game: this.game,
        x: POS_CARD_2,
        y: TOP_CARD_Y,
        frameX: 1,
        frameY: 4,
      }),
      new Card({
        game: this.game,
        x: POS_CARD_3,
        y: TOP_CARD_Y,
        frameX: 1,
        frameY: 4,
      }),
    ];
  }

  removeAllCards() {
    this.cards = [];
    this.playedCards = [];
  }
}
