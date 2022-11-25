export class Player {
  constructor({ game }) {
    this.game = game;
    this.name = "";
    this.itIsHand = false;
    this.hisTurn = false;
  }

  baseValues() {
    this.score = 0;
    this.cards = [];
    this.cardsInHand = [];
    this.envidoWinnerPoints = 0;
    this.florWinnerPoints = 0;
    this.trucoPoints = 0;
    this.envidoS = [];
    this.realEnvido = [];
    this.envidoEnvido = [];
    this.faltaEnvido = [];
    this.playedCards = [];
    this.hands = 0;
  }

  draw(ctx) {
    [...this.cardsInHand].forEach((card) => card.draw(ctx));
  }

  setName(name) {
    this.name = name;
  }

  getEnvidoPoints() {
    const pair = {
      Oro: [],
      Espada: [],
      Basto: [],
      Copa: [],
    };

    this.cards.forEach((card) => {
      pair[card.suit].push(card.envidoPoints);
    });
    let points = 0;
    for (const prop in pair) {
      if (pair.hasOwnProperty(prop)) {
        if (pair[prop].length >= 2) {
          if (pair[prop].length === 3) {
            pair[prop].sort(function (a, b) {
              return b - a;
            });
          }
          points = 20 + pair[prop][0] + pair[prop][1];
          break;
        }
      }
    }
    if (points === 0) {
      let max = 0;
      for (const prop in pair) {
        if (pair[prop].length > 0 && max < pair[prop][0]) {
          max = pair[prop][0];
        }
      }
      points = max;
    }
    return points;
  }
}
