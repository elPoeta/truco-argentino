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
        break;
      case "faltaEnvido":
        break;
      case "realEnvido":
        break;
      case "FaltaEnvido":
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
