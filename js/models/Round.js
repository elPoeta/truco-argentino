export class Round {
  constructor({ game }) {
    this.game = game;
    this.numberOfHands = 0;
    this.playsOnHands = 0;
    this.playerTurn = null;
    this.waiting = false;

    this.canEnvido = true;
    this.chants = [];
    this.playerEnvido = null;
    this.whoSang = [];
    this.envidoStatsFlag = true;
    this.savedPoints = null;

    this.playerTruco = null;
    this.canTruco = null;
    this.playerDoesNotWant = null;
    this.truco = [];
  }
}
