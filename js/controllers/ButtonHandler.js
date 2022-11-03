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
    const lastSang = this.game.round.chants.getLast();
    let dataEnvido = target.dataset.envido;
    console.log("DATA", dataEnvido);
    if (lastSang === Action.ENVIDO && dataEnvido === Action.ENVIDO)
      dataEnvido = Action.ENVIDO_ENVIDO;
    this.game.round.canEnvido = false;
    this.game.round.chants.push(dataEnvido);
    this.game.round.whoSang.push(Action.HUMAN);
    this.game.round.waiting = false;
    this.game.round.playerEnvido = this.game.round.waitingPlayer(
      this.game.round.playerEnvido
    );
    // WRITE LOG TEXT
    const envidoButtons = document.querySelector("#envido-buttons");
    envidoButtons.querySelectorAll("button").forEach((button) => {
      button.classList.add("hide");
    });
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

// _quiero.unbind("click").click(function (event) {
//   _rondaActual.logCantar(_rondaActual.equipoEnvido.jugador, "S");
//   _rondaActual.jugarEnvido(true);
//   _rondaActual.enEspera = false;
//   $(this).unbind("click");
//   _rondaActual.continuarRonda();
// });

// _noQuiero.unbind("click").click(function (event) {
//   _rondaActual.logCantar(_rondaActual.equipoEnvido.jugador, "N");
//   _rondaActual.jugarEnvido(false);
//   _rondaActual.enEspera = false;
//   $(this).unbind("click");
//   _rondaActual.continuarRonda();
// });
