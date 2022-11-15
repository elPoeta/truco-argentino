import { canvas } from "../app.js";
import { IA } from "../models/IA.js";
import {
  isEmpty,
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
    this.lastTouch = null;
    canvas.addEventListener("mousedown", this.handleMouseDown.bind(this), true);
    canvas.addEventListener("mousemove", this.handleMouseMove.bind(this), true);
    canvas.addEventListener("mouseup", this.handleMouseUp.bind(this), true);
    canvas.addEventListener(
      "touchstart",
      this.handleTouchStart.bind(this),
      true
    );
    canvas.addEventListener("touchmove", this.handleTouchMove.bind(this), true);
    canvas.addEventListener("touchend", this.handleTouchEnd.bind(this), true);
  }

  setMousePos(ev) {
    const { top, left, width, height } = this.game.canvasPosition;
    const scaleX = canvas.width / width;
    const scaleY = canvas.height / height;
    this.mouseX = (ev.clientX - left) * scaleX;
    this.mouseY = (ev.clientY - top) * scaleY;
  }

  changeCursor() {
    this.game.humanPlayer.cardsInHand.forEach((card) => {
      if (!card.isTouching(this.mouseX, this.mouseY)) {
        canvas.style.cursor = "default";
      }
    });
    this.game.humanPlayer.cardsInHand.forEach((card) => {
      if (card.isTouching(this.mouseX, this.mouseY)) {
        canvas.style.cursor = "pointer";
      }
    });
  }

  dispatchMouseEvent(props) {
    const { touch, type, element } = props;
    const options = !isEmpty(touch)
      ? { clientX: touch.clientX, clientY: touch.clientY }
      : touch;
    element.dispatchEvent(new MouseEvent(type, options));
  }

  handleTouchStart(ev) {
    ev.preventDefault();
    const touch = ev.touches[0];
    this.lastTouch = touch;
    this.dispatchMouseEvent({
      touch,
      type: "mousedown",
      element: canvas,
    });
  }

  handleTouchMove(ev) {
    ev.preventDefault();
    const touch = ev.touches[0];
    this.lastTouch = touch;
    this.dispatchMouseEvent({
      touch,
      type: "mousemove",
      element: canvas,
    });
  }

  handleTouchEnd(ev) {
    ev.preventDefault();
    this.dispatchMouseEvent({
      touch: this.lastTouch,
      type: "mouseup",
      element: canvas,
    });
  }

  handleMouseDown(ev) {
    if (this.game.round.playerTurn instanceof IA) return;
    this.setMousePos(ev);
    this.game.humanPlayer.cardsInHand = this.game.humanPlayer.cardsInHand.map(
      (card) => {
        if (card.isTouching(this.mouseX, this.mouseY)) {
          card.isGrabbed = true;
        } else {
          card.isGrabbed = false;
        }
        return card;
      }
    );
  }

  handleMouseMove(ev) {
    this.setMousePos(ev);
    this.changeCursor();
    this.game.humanPlayer.cardsInHand = this.game.humanPlayer.cardsInHand.map(
      (card) => {
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
      }
    );
  }

  handleMouseUp(ev) {
    let index = -1;
    this.game.humanPlayer.cardsInHand = this.game.humanPlayer.cardsInHand.map(
      (card, i) => {
        if (card.isGrabbed) index = i;
        card.isGrabbed = false;
        return card;
      }
    );
    this.game.renderDashedArea = false;
    this.game.humanPlayer.playCard(index);
  }
}
