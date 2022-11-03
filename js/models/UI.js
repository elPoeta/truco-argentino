import { canvas } from "../app.js";
import { ButtonHandler } from "../controllers/ButtonHandler.js";
export class UI {
  constructor({ game }) {
    this.game = game;
    this.panel = document.querySelector(".panel");
    this.voicePanel = document.querySelector(".voice-panel");
    this.cssPosition();
    this.buttonHandler = new ButtonHandler({ game, ui: this });
  }

  cssPosition() {
    const { top, left, right } = canvas.getBoundingClientRect();

    this.panel.style.left = `${left + 10}px`;
    this.panel.style.bottom = `${top + 10}px`;
    this.panel.classList.remove("hide");

    this.voicePanel.style.left = `${right - 135}px`;
    this.voicePanel.style.bottom = `${top + 10}px`;
    this.voicePanel.classList.remove("hide");
  }
}
