import { Card } from "./Card.js";

export class Deck {
  constructor({ game }) {
    this.game = game;
    this.suits = ["Oro", "Copa", "Espada", "Basto"];
    this.cardNumbers = [1, 2, 3, 4, 5, 6, 7, 11, 12];
    this.weight = {
      Oro: [8, 9, 10, 2, 3, 4, 13, 1, 1, 1, 6, 7],
      Copa: [8, 9, 10, 2, 3, 4, 5, 1, 1, 1, 6, 7],
      Espada: [14, 9, 10, 2, 3, 4, 12, 1, 1, 1, 6, 7],
      Basto: [13, 9, 10, 2, 3, 4, 5, 1, 1, 1, 6, 7],
    };
  }

  generate() {
    return this.suits
      .map((suit, indexY) => {
        return this.cardNumbers.map((cardNumber, indexX) => {
          return new Card({
            game: this.game,
            frameX: cardNumber - 1,
            frameY: indexY,
            cardValue: this.weight[suit][indexX],
            cardNumber: cardNumber,
            cardSuit: suit,
            envidoPoints: cardNumber < 10 ? cardNumber : 0,
          });
        });
      })
      .flat();
  }
}
