export class Player {
  constructor({ game, name, itIsHand, hisTurn }) {
    this.game = game;
    this.name = name;
    this.score = 0;
    this.cards = [];
    this.cardsInHand = [];
    this.envidoWinnerPoints = 0;
    this.trucoPoints = 0;
    this.envidoS = [];
    this.realEnvido = [];
    this.envidoEnvido = [];
    this.faltaEnvido = [];
    this.playedCards = [];
    this.hands = 0;
    this.itIsHand = itIsHand;
    this.hisTurn = hisTurn;
  }

  draw(ctx) {
    [...this.cardsInHand, ...this.playedCards].forEach((card) =>
      card.draw(ctx)
    );
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
    console.log("PAIR ", pair);
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
