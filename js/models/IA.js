import { IA_CARD_1, IA_CARD_2, IA_CARD_3 } from "../utils/helpers.js";
import { Card } from "./Card.js";
import { Player } from "./Player.js";

export class IA extends Player {
  constructor({ game, name }) {
    super({ game, name });
    this.cards = [
      new Card({ game, x: IA_CARD_1, y: 10, frameX: 1, frameY: 4 }),
      new Card({ game, x: IA_CARD_2, y: 10, frameX: 1, frameY: 4 }),
      new Card({ game, x: IA_CARD_3, y: 10, frameX: 1, frameY: 4 }),
    ];
  }
}
