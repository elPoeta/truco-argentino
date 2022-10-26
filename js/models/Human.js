import {
  POS_CARD_1,
  POS_CARD_2,
  POS_CARD_3,
  BOTTOM_CARD_Y,
} from "../utils/helpers.js";
import { Card } from "./Card.js";
import { Player } from "./Player.js";

export class Human extends Player {
  constructor({ game, name }) {
    super({ game, name });
    this.cards = [
      new Card({ game, x: POS_CARD_1, y: BOTTOM_CARD_Y, frameX: 0, frameY: 1 }),
      new Card({ game, x: POS_CARD_2, y: BOTTOM_CARD_Y, frameX: 1, frameY: 2 }),
      new Card({ game, x: POS_CARD_3, y: BOTTOM_CARD_Y, frameX: 2, frameY: 3 }),
    ];
  }
}
