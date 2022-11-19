import { menu } from "../app.js";
import { Action } from "../models/Action.js";
import { InputHandler } from "./InputHandler.js";

export class KeyHandler extends InputHandler {
  constructor({ game }) {
    super({ game });
    window.addEventListener("keydown", this.handleKeydown.bind(this), true);
  }

  handleKeydown(ev) {
    ev.preventDefault();
    const key = ev.key;
    switch (key) {
      case "1":
      case "2":
      case "3":
        this.handlePlayCardsAction(key);
        break;
      case "F1":
        if (this.isNotEnableButton("envido")) break;
        this.handleEnvidoActions({ dataEnvido: Action.ENVIDO });
        break;
      case "F2":
        if (this.isNotEnableButton("realEnvido")) break;
        this.handleEnvidoActions({ dataEnvido: Action.REAL_ENVIDO });
        break;
      case "F3":
        if (this.isNotEnableButton("faltaEnvido")) break;
        this.handleEnvidoActions({ dataEnvido: Action.FALTA_ENVIDO });
        break;
      case "F4":
        if (this.isNotEnableButton("truco")) break;
        this.handleTrucoActions({ dataTruco: Action.TRUCO });
        break;
      case "F5":
        if (this.isNotEnableButton("reTruco")) break;
        this.handleTrucoActions({ dataTruco: Action.RE_TRUCO });
        break;
      case "F6":
        if (this.isNotEnableButton("vale4")) break;
        this.handleTrucoActions({ dataTruco: Action.VALE_4 });
        break;
      case "F7":
        if (this.isNotEnableButton("response-buttons")) break;
        this.handleResponseActions({ dataResponse: Action.QUIERO });
        break;
      case "F8":
        if (this.isNotEnableButton("response-buttons")) break;
        this.handleResponseActions({ dataResponse: Action.NO_QUIERO });
        break;
      case "F9":
        this.handleMazoAction();
        break;
      case "Escape":
        this.handleMenuAction();
        break;
      case "F11":
        this.game.ui.buttonHandler.fullscreen.handleFullscreen();
        break;
      case "x":
        this.closeOverlay();
        break;
      case " ":
        this.game.speechRecognition.run();
        break;
      default:
        break;
    }
  }

  closeOverlay() {
    if (document.querySelector("#resultsOverlay"))
      this.game.ui.handleCloseOverlay();
    if (document.querySelector("#closeMenuOverlay") && this.game.gameStarted)
      menu.handleCloseMenu();
  }
}
