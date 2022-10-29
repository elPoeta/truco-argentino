import {
  POS_CARD_1,
  POS_CARD_2,
  POS_CARD_3,
  TOP_CARD_Y,
} from "../utils/helpers.js";
import { Card } from "./Card.js";
import { Player } from "./Player.js";

export class IA extends Player {
  constructor({ game, name, itIsHand, hisTurn }) {
    super({ game, name, itIsHand, hisTurn });
    this.cardsInHand = [
      // new Card({ game, x: POS_CARD_1, y: TOP_CARD_Y, frameX: 1, frameY: 4 }),
      // new Card({ game, x: POS_CARD_2, y: TOP_CARD_Y, frameX: 1, frameY: 4 }),
      // new Card({ game, x: POS_CARD_3, y: TOP_CARD_Y, frameX: 1, frameY: 4 }),
    ];
    this.cards = [];
  }
}
