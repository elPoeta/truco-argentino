import { canvas, menu } from "../app.js";
import { ButtonHandler } from "../controllers/ButtonHandler.js";
import { KeyHandler } from "../controllers/KeyHandler.js";
import { Human } from "./Human.js";
import { IA } from "./IA.js";
export class UI {
  constructor({ game }) {
    this.game = game;
    this.body = document.querySelector("body");
    this.panel = document.querySelector(".panel");
    this.voicePanel = document.querySelector(".voice-panel");
    this.cssPosition();
    this.buttonHandler = new ButtonHandler({ game, ui: this });
    this.keyHandler = new KeyHandler({ game });
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

  hideButtons() {
    const envidoButtons = document.querySelector("#envido-buttons");
    const trucoButtons = document.querySelector("#truco-buttons");
    document.querySelector("#response-buttons").classList.add("hide");
    envidoButtons
      .querySelectorAll("button")
      .forEach((button) => button.classList.add("hide"));
    trucoButtons
      .querySelectorAll("button")
      .forEach((button) => button.classList.add("hide"));
  }

  showResults(props) {
    if (document.querySelector("#winnerOverlay")) return;
    const div = document.createElement("div");
    div.setAttribute("id", "resultsOverlay");
    div.setAttribute("class", "overlay");
    div.innerHTML = this.resultsTemplate(props);
    this.body.appendChild(div);
    this.addResultSelectors();
  }

  resultsTemplate(props) {
    const { playerWinner } = props;
    const iaMsg = playerWinner instanceof IA ? "😜 Te Gane!!!" : "🤬 #%!&";
    const humanMsg = playerWinner instanceof Human ? "😀 Gane!!!" : "🤬 #%!&";
    return `
      <i id="closeOverlay" class="closeResultOverlay">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
          <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
        </svg>
      </i>
      <section class="result-container">
        <h3>Resultado de la ronda</h3>
        <hr class="result-divide-line"/>
        <div class="mobile-result-container">
          <div class="player-result">
            <figure class="image-container">
              <img class="result-img" src='${
                document.querySelector("#playerImg").src
              }' alt="palyer1">
            </figure>
            <div class="result-content">
              <h4>${humanMsg}</h4>
              <div>
                <h5>Puntos Envido: ${
                  this.game.humanPlayer.envidoWinnerPoints
                }</h5>
                ${
                  this.game.round.withFlor
                    ? ` <h5>Puntos Flor: ${this.game.humanPlayer.florWinnerPoints}</h5>`
                    : ""
                }
                <h5>Puntos Truco: ${this.game.humanPlayer.trucoPoints}</h5>
                <h5>Puntos Ronda: ${
                  this.game.humanPlayer.envidoWinnerPoints +
                  this.game.humanPlayer.trucoPoints +
                  this.game.humanPlayer.florWinnerPoints
                }</h5>
                <h5>Puntos Totales: ${this.game.humanPlayer.score}</h5>
              </div>
            </div>
            <span>${this.game.humanPlayer.name}</span>
          </div>
          <div class="player-result">
            <figure class="image-container">
              <img class="result-img" src='${
                document.querySelector("#cpuImg").src
              }' alt="elPoeta">
            </figure>
            <div class="result-content">
              <h4>${iaMsg}</h4>
              <div>
                <h5>Puntos Envido: ${this.game.IAPlayer.envidoWinnerPoints}</h5>
                ${
                  this.game.round.withFlor
                    ? ` <h5>Puntos Flor: ${this.game.IAPlayer.florWinnerPoints}</h5>`
                    : ""
                }
                <h5>Puntos Truco: ${this.game.IAPlayer.trucoPoints}</h5>
                <h5>Puntos Ronda: ${
                  this.game.IAPlayer.envidoWinnerPoints +
                  this.game.IAPlayer.trucoPoints +
                  this.game.IAPlayer.florWinnerPoints
                }</h5>
                <h5>Puntos Totales: ${this.game.IAPlayer.score}</h5>
              </div>
            </div>
            <span>${this.game.IAPlayer.name}</span>
          </div>
        </div>
      </section>
              `;
  }

  addResultSelectors() {
    this.closeOverlay = document.querySelector("#closeOverlay");
    this.resultListenerManager({ type: "addEventListener" });
  }

  resultListenerManager({ type }) {
    this.closeOverlay[type]("click", this.handleCloseOverlay.bind(this), true);
  }

  handleCloseOverlay(ev) {
    this.resultListenerManager({ type: "removeEventListener" });
    document.querySelector("#resultsOverlay").remove();
    this.game.round.startNewRound();
  }

  showWinner(playerWinner) {
    if (document.querySelector("#resultsOverlay")) {
      this.resultListenerManager({ type: "removeEventListener" });
      document.querySelector("#resultsOverlay").remove();
    }
    const div = document.createElement("div");
    div.setAttribute("id", "winnerOverlay");
    div.setAttribute("class", "overlay");
    div.innerHTML = this.winnerTemplate(playerWinner);
    this.body.appendChild(div);
    this.addWinnerSelectors();
  }

  winnerTemplate(playerWinner) {
    const message = `Ganador ${playerWinner.name}`;
    const playerImage = playerWinner instanceof Human ? "playerImg" : "cpuImg";
    return `
      <section class="result-container">
        <h3>${message}</h3>
        <hr class="result-divide-line"/>
        <div class="mobile-result-container">
          <div class="winner-images">
            <figure class="image-container image-player-container">
              <img class="result-img winner-player-img" src='${
                document.querySelector(`#${playerImage}`).src
              }' alt="player-winner">
             </figure>
            <figure class="image-cup-container">
              <img class="winner-cup-img" src='${
                document.querySelector(`#cupImg`).src
              }' alt="winner-cup">
            </figure>
          </div>
          <div class="player-winner-buttons">
            <div id="winner-buttons" class="btn-container">
              <button id="newGame" class="btn btn-winner">
                <span class="btn-content">NUEVA</span>
              </button>
              <button id="winnerMenu" class="btn btn-winner">
                <span class="btn-content">MENU</span>
              </button>
            </div>
          </div>
        </div>
      </section>
              `;
  }

  addWinnerSelectors() {
    this.winnerButtons = document.querySelector("#winner-buttons");
    this.winnerListenerManager({ type: "addEventListener" });
  }

  winnerListenerManager({ type }) {
    this.winnerButtons[type](
      "click",
      this.handleWinnerButtons.bind(this),
      true
    );
  }

  handleWinnerButtons(ev) {
    const target = ev.target.closest(".btn-winner");
    if (!target) return;
    const id = target.id;
    if (!id) return;
    if (id === "newGame") {
      this.newGameAction();
    } else {
      this.menuAction();
    }
  }

  newGameAction() {
    this.removeWinnerOverlay();
    const { playerName, scoreLimit, enableIAVoice, withFlor } =
      menu.getOptions();
    this.game.newGame({ playerName, scoreLimit, enableIAVoice, withFlor });
  }

  menuAction() {
    this.removeWinnerOverlay();
    menu.render();
  }

  removeWinnerOverlay() {
    this.winnerListenerManager({ type: "removeEventListener" });
    document.querySelector("#winnerOverlay").remove();
  }
}
