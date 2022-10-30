export class Envido {

  static #_E = 'E';
  static #_EE = 'EE';
  static #_RE = 'RE';
  static #_FE = 'FE';

  static get ENVIDO() {
    return Envido.#_E;
  }

  static get ENVIDO_ENVIDO() {
    return Envido.#_EE;
  }

  static get REAL_ENVIDO() {
    return Envido.#_RE;
  }

  static get FALTA_ENVIDO() {
    return Envido.#_FE;
  }

}