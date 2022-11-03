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
        break;
      case "reTruco":
        break;
      case "vale4":
        break;
      case "quiero":
        break;
      case "noQuiero":
        break;
      case "irAlMazo":
        break;
      case "menu":
        break;
      default:
        break;
    }
  }

  handleEnvidoActions({ target }) {
    const dataEnvido = target.dataset.envido;
    console.log("DATA", dataEnvido);
    this.game.round.canEnvido = false;
    this.game.round.chants.push(dataEnvido);
    this.game.round.whoSang.push(Action.HUMAN);
    this.game.round.waiting = false;
    this.game.round.playerEnvido = this.game.round.waitingPlayer(
      this.game.round.playerTurn
    );
    // WRITE LOG TEXT
    document.querySelector("#envido-buttons").classList.add("hide");
    // this.game.round.swapTurn();
    this.game.round.continue();
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
