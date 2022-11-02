export class Player {
  constructor({ game, name, itIsHand, hisTurn }) {
    this.game = game;
    this.name = name;
    this.score = 0;
    this.cards = [];
    this.cardsInHand = [];
    this.envidoWinnerPoints = 0;
    this.envidoS = [];
    this.realEnvido = [];
    this.revire = [];
    this.faltaEnvido = [];
    this.playedCards = [];
    this.hands = 0;
    this.itIsHand = itIsHand;
    this.hisTurn = hisTurn;
  }

  // update() {
  //   [...this.cards].forEach((card) => card.update());
  // }

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

    let points = 0;
    for (const prop in pair) {
      if (pair.hasOwnProperty(prop)) {
        if (pair[prop].length >= 2) {
          if (pair[prop].length === 3) {
            pair[prop].sort(function (a, b) {
              return b - a;
            });
          }
          points = 20 + points[prop][0] + points[prop][1];
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
