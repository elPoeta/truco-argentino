export class Player {
  constructor({ game, name }) {
    this.game = game;
    this.name = name;
    this.cards = [];
  }

  update() {
    //console.log(">>>>>>", this.cards);
    [...this.cards].forEach((card) => card.update());
  }

  draw(ctx) {
    [...this.cards].forEach((card) => card.draw(ctx));
  }

  setName(name) {
    this.name = name;
  }
}
