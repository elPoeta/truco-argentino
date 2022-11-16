import { Fullscreen } from "./fullScreen.js";
import { InputHandler } from "./InputHandler.js";

export class ButtonHandler extends InputHandler {
  constructor({ game, ui }) {
    super({ game });
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
        this.handleEnvidoActions({ dataEnvido: target.dataset.envido });
        break;
      case "truco":
      case "reTruco":
      case "vale4":
        this.handleTrucoActions({ dataTruco: target.dataset.truco });
        break;
      case "quiero":
      case "noQuiero":
        this.handleResponseActions({ dataResponse: target.dataset.response });
        break;
      case "irAlMazo":
        this.handleMazoAction();
        break;
      case "menu":
        this.handleMenuAction();
        break;
      default:
        break;
    }
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
