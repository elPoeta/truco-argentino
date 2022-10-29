export class Player {
  constructor({ game, name, itIsHand, hisTurn }) {
    this.game = game;
    this.name = name;
    this.score = 0;
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
}
