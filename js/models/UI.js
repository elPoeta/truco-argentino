import { canvas } from "../app.js";
export class UI {
  constructor({ game }) {
    this.game = game;
    this.panel = document.querySelector(".panel");
    this.cssPosition();
  }

  cssPosition() {
    const { top, left } = canvas.getBoundingClientRect();
    this.panel.style.left = `${left + 10}px`;
    this.panel.style.bottom = `${top + 10}px`;
    this.panel.classList.remove("hide");
  }
}
