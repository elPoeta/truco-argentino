import { canvas } from "../app.js";
import {
  PLAYED_AREA_H,
  PLAYED_AREA_W,
  PLAYED_AREA_X,
  PLAYED_AREA_Y,
} from "../utils/helpers.js";

export class EventHandler {
  constructor({ game }) {
    this.game = game;
    this.mouseX = 0;
    this.mouseY = 0;
    canvas.addEventListener("mousedown", this.handleMouseDown.bind(this), true);
    canvas.addEventListener("mousemove", this.handleMouseMove.bind(this), true);
    canvas.addEventListener("mouseup", this.handleMouseUp.bind(this), true);
  }

  handleMouseDown(ev) {
    const rect = canvas.getBoundingClientRect();
    this.mouseX = ev.clientX - rect.left;
    this.mouseY = ev.clientY - rect.top;
    this.game.players[1].cards = this.game.players[1].cards.map((card) => {
      if (card.isTouching(this.mouseX, this.mouseY)) {
        card.isGrabbed = true;
      } else {
        card.isGrabbed = false;
      }
      return card;
    });
  }

  handleMouseMove(ev) {
    const rect = canvas.getBoundingClientRect();
    this.mouseX = ev.clientX - rect.left;
    this.mouseY = ev.clientY - rect.top;
    this.game.players[1].cards = this.game.players[1].cards.map((card) => {
      if (card.isGrabbed) {
        card.update({
          x: this.mouseX - (card.width * 0.7) / 2,
          y: this.mouseY - (card.height * 0.7) / 2,
        });
        this.game.renderDashedArea = card.isColliding({
          x: PLAYED_AREA_X,
          y: PLAYED_AREA_Y,
          w: PLAYED_AREA_W,
          h: PLAYED_AREA_H,
        });
      }
      return card;
    });
  }

  handleMouseUp(ev) {
    this.game.players[1].cards = this.game.players[1].cards.map((card) => {
      card.isGrabbed = false;
      return card;
    });
    this.game.renderDashedArea = false;
  }
}
