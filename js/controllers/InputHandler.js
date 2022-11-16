import { menu } from "../app.js";
import { Action } from "../models/Action.js";
export class InputHandler {
  constructor({ game }) {
    this.game = game;
  }

  handleEnvidoActions({ dataEnvido }) {
    const lastSang = !this.game.round.chants.length
      ? ""
      : this.game.round.chants[this.game.round.chants.length - 1];
    if (lastSang === Action.ENVIDO && dataEnvido === Action.ENVIDO)
      dataEnvido = Action.ENVIDO_ENVIDO;
    this.game.logMessage.show({
      player: Action.HUMAN,
      action: dataEnvido,
    });
    this.game.round.canEnvido = false;
    this.game.round.chants.push(dataEnvido);
    this.game.round.whoSang.push(Action.HUMAN);
    this.game.round.waiting = false;
    this.game.round.playerEnvido = this.game.round.waitingPlayer(
      this.game.humanPlayer
    );
    const envidoButtons = document.querySelector("#envido-buttons");
    envidoButtons.querySelectorAll("button").forEach((button) => {
      button.classList.add("hide");
    });
    this.game.round.continue();
  }

  handleTrucoActions({ dataTruco }) {
    this.game.round.truco.push(dataTruco);
    this.game.round.playerTruco = this.game.round.waitingPlayer(
      this.game.humanPlayer
    );
    this.game.logMessage.show({
      player: Action.HUMAN,
      action: dataTruco,
    });
    this.game.round.waiting = false;
    const trucoButtons = document.querySelector("#truco-buttons");
    trucoButtons.querySelectorAll("button").forEach((button) => {
      button.classList.add("hide");
    });
    this.game.round.continue();
  }

  handleResponseActions({ dataResponse }) {
    const executeAction = this.getExecuteAction();
    this[executeAction](dataResponse);
    document.querySelector("#response-buttons").classList.add("hide");
    this.game.round.waiting = false;
    this.game.round.continue();
  }

  executeResponseEnvido(dataResponse) {
    this.game.logMessage.show({
      player: Action.HUMAN,
      action: dataResponse,
    });
    const envidoButtons = document.querySelector("#envido-buttons");
    envidoButtons.querySelectorAll("button").forEach((button) => {
      button.classList.add("hide");
    });
    this.game.round.playEnvido(dataResponse === Action.QUIERO);
  }

  executeResponseTruco(dataResponse) {
    if (dataResponse === Action.QUIERO) {
      this.game.round.playerTruco = null;

      this.game.round.canTruco = this.game.humanPlayer;
    } else {
      this.game.round.playerDoesNotWant = this.game.humanPlayer;
    }
    this.game.logMessage.show({
      player: Action.HUMAN,
      action: dataResponse,
    });
  }

  getExecuteAction() {
    return this.game.round.currentResponse === Action.ENVIDO
      ? "executeResponseEnvido"
      : "executeResponseTruco";
  }

  handleMazoAction() {
    this.game.round.humanGoToMazo();
  }

  handleMenuAction() {
    menu.render();
  }
}
