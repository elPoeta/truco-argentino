import { menu } from "../app.js";
import { Action } from "../models/Action.js";
import { IA } from "../models/IA.js";
export class InputHandler {
  constructor({ game }) {
    this.game = game;
  }

  handleEnvidoActions({ dataEnvido }) {
    if (this.game.round.envidoBefore) this.game.round.cancelTruco();
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

  handleFlorActions({ dataFlor }) {
    //if (this.game.round.envidoBefore) this.game.round.cancelTruco();
    //  const lastSang = this.game.round.getLastItem(this.game.round.flores);

    this.game.logMessage.show({
      player: Action.HUMAN,
      action: dataFlor,
    });
    this.game.round.canFlor = false;
    this.game.round.flores.push(dataFlor);
    this.game.round.whoSang.push(Action.HUMAN);
    this.game.round.waiting = false;
    this.game.round.playerFlor = this.game.round.waitingPlayer(
      this.game.humanPlayer
    );
    const envidoButtons = document.querySelector("#flor-buttons");
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
    this.game.round.waiting = false;
    this.game.round.continue();
  }

  executeResponseFlor(dataResponse) {
    this.game.logMessage.show({
      player: Action.HUMAN,
      action: dataResponse,
    });
    const florButtons = document.querySelector("#flor-buttons");
    florButtons.querySelectorAll("button").forEach((button) => {
      button.classList.add("hide");
    });
    document.querySelector("#noQuiero").classList.remove("hide");
    this.game.round.playFlor(Action.QUIERO);
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
    if (this.game.round.currentResponse === Action.FLOR) {
      return "executeResponseFlor";
    } else if (this.game.round.currentResponse === Action.ENVIDO) {
      return "executeResponseEnvido";
    } else {
      return "executeResponseTruco";
    }
  }

  handleMazoAction() {
    this.game.round.humanGoToMazo();
  }

  handleMenuAction() {
    menu.render();
  }

  handlePlayCardsAction(key) {
    if (this.game.round.playerTurn instanceof IA) return;
    const card = this.game.humanPlayer.cards[key - 1];
    if (card.played) return;
    const index = this.game.humanPlayer.cardsInHand.findIndex(
      (c) => c.number === card.number && c.suit === card.suit
    );
    if (index < 0) return;
    this.game.humanPlayer.playCard(index);
  }

  isNotEnableButton(selector) {
    return document.querySelector(`#${selector}`).classList.contains("hide");
  }
}
