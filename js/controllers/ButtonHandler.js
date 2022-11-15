import { menu } from "../app.js";
import { Action } from "../models/Action.js";
import { Fullscreen } from "./fullScreen.js";

export class ButtonHandler {
  constructor({ game, ui }) {
    this.game = game;
    this.ui = ui;
    this.ui.panel.addEventListener("click", this.handlePanel.bind(this), true);
    this.ui.voicePanel.addEventListener(
      "click",
      this.handleVoicePanel.bind(this),
      true
    );
    this.fullscreen = new Fullscreen();
  }

  handlePanel(ev) {
    const target = ev.target.closest(".btn");
    if (!target) return;
    const id = target.id;
    if (!id) return;
    switch (id) {
      case "envido":
      case "faltaEnvido":
      case "realEnvido":
      case "FaltaEnvido":
        this.handleEnvidoActions({ target });
        break;
      case "truco":
      case "reTruco":
      case "vale4":
        this.handleTrucoActions({ target });
        break;
      case "quiero":
      case "noQuiero":
        this.handleResponseActions({ target });
        break;
      case "irAlMazo":
        this.game.round.humanGoToMazo();
        break;
      case "menu":
        menu.render();
        break;
      default:
        break;
    }
  }

  handleEnvidoActions({ target }) {
    const lastSang = !this.game.round.chants.length
      ? ""
      : this.game.round.chants[this.game.round.chants.length - 1];
    let dataEnvido = target.dataset.envido;
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

  handleTrucoActions({ target }) {
    const dataTruco = target.dataset.truco;
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

  handleResponseActions({ target }) {
    const dataResponse = target.dataset.response;
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

  handleVoicePanel(ev) {
    const target = ev.target.closest(".panel-icon");
    if (!target) return;
    const id = target.id;
    if (!id) return;
    switch (id) {
      case "commandVoice":
        break;
      case "fullScreen":
        this.fullscreen.handleFullscreen();
        break;
      default:
        break;
    }
  }
}
