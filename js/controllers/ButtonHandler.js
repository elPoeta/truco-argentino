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
        this.game.round.debugLog();
        break;
      default:
        break;
    }
  }

  handleEnvidoActions({ target }) {
    const lastSang = this.game.round.chants.getLast();
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
    console.log("TRUCO ACTION ", dataTruco);
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
    //this.game.round.waiting = false;
    //this.game.round.continue();
  }

  getExecuteAction() {
    console.log("CURRETN RESPONSE", this.game.round.currentResponse);
    return this.game.round.currentResponse === Action.ENVIDO
      ? "executeResponseEnvido"
      : "executeResponseTruco";
    // let lastSang = "";
    // if (this.game.round.currentResponse === Action.ENVIDO) {
    //   console.log(
    //     "@@@@@ ".this.game.round.chants.length,
    //     this.game.round.chants
    //   );
    //   lastSang = !this.game.round.chants.length
    //     ? ""
    //     : this.game.round.chants.length[this.game.round.chants.length - 1];
    // } else if (this.game.round.currentResponse === Action.truco) {
    //   lastSang = !this.game.round.truco.length
    //     ? ""
    //     : this.game.round.truco.length[this.game.round.truco.length - 1];
    // }
    // console.log("***** ", lastSang);
    // switch (lastSang) {
    //   case Action.ENVIDO:
    //   case Action.ENVIDO_ENVIDO:
    //   case Action.REAL_ENVIDO:
    //   case Action.FALTA_ENVIDO:
    //     return "executeResponseEnvido";
    //   case Action.TRUCO:
    //   case Action.RE_TRUCO:
    //   case Action.VALE_4:
    //     return "executeResponseTruco";
    // }
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
