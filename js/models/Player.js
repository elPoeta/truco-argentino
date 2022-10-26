export class Player {
  constructor({ game, name }) {
    this.game = game;
    this.name = name;
    this.cards = [];
    this.score = 0;
  }

  update() {
    [...this.cards].forEach((card) => card.update());
  }

  draw(ctx) {
    [...this.cards].forEach((card) => card.draw(ctx));
  }

  setName(name) {
    this.name = name;
  }
}
