import {
  LOG_TEXT_X,
  LOG_TEXT_Y_BOTTOM,
  LOG_TEXT_Y_TOP,
} from "../utils/helpers.js";
import { Action } from "./Action.js";
import { Human } from "./Human.js";

export class LogMessage {
  constructor({ game }) {
    this.game = game;
    this.human = "";
    this.ia = "";
  }

  draw(ctx) {
    ctx.font = "50px Bangers";
    ctx.fillStyle = "#f59e0b";
    ctx.textAlign = "center";
    ctx.fillText(this.ia, LOG_TEXT_X, LOG_TEXT_Y_TOP);
    ctx.fillText(this.human, LOG_TEXT_X, LOG_TEXT_Y_BOTTOM);
  }

  show({ player, action }) {
    const { msg, clean } = this.getMessage(action);
    if (player === Action.HUMAN) {
      this.human = msg;
      //this.ia = clean ? "" : this.ia;
    } else {
      this.ia = msg;
      //this.human = clean ? "" : this.human;
    }
  }

  getMessage(action) {
    console.log("Action LOG ", action);
    switch (action) {
      case Action.ENVIDO:
      case Action.ENVIDO_ENVIDO:
        return { msg: "Envido", clean: true };
      case Action.REAL_ENVIDO:
        return { msg: "Real Envido", clean: true };
      case Action.FALTA_ENVIDO:
        return { msg: "Falta Envido", clean: true };
      case Action.TRUCO:
        return { msg: "Truco!", clean: true };
      case Action.RE_TRUCO:
        return { msg: "Quiero Re-Truco!", clean: true };
      case Action.VALE_4:
        return { msg: "Quiero vale Cuatro!", clean: true };
      case Action.QUIERO:
        return { msg: "Quiero", clean: true };
      case Action.NO_QUIERO:
        return { msg: "No Quiero", clean: true };
      case Action.MAZO:
        return { msg: "Me voy al mazo.", clean: true };
      default:
        return { msg: action, clean: false };
    }
  }
}
