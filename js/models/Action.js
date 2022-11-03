export class Action {
  static #_E = "E";
  static #_EE = "EE";
  static #_RE = "RE";
  static #_FE = "FE";

  static #_T = "T";
  static #_RT = "RT";
  static #_V4 = "V4";

  static #_Q = "QUIERO";
  static #_NQ = "NO_QUIERO";

  static #_M = "MAZO";

  static #_H = "HUMAN";
  static #_IA = "IA";

  static get ENVIDO() {
    return Action.#_E;
  }

  static get ENVIDO_ENVIDO() {
    return Action.#_EE;
  }

  static get REAL_ENVIDO() {
    return Action.#_RE;
  }

  static get FALTA_ENVIDO() {
    return Action.#_FE;
  }

  static get TRUCO() {
    return Action.#_T;
  }

  static get RE_TRUCO() {
    return Action.#_RT;
  }

  static get VALE_4() {
    return Action.#_V4;
  }

  static get QUIERO() {
    return Action.#_Q;
  }

  static get NO_QUIERO() {
    return Action.#_NQ;
  }

  static get MAZO() {
    return Action.#_M;
  }

  static get HUMAN() {
    return Action.#_H;
  }

  static get IA() {
    return Action.#_IA;
  }
}
