export class Menu {
  constructor({ game }) {
    this.game = game;
    this.body = document.querySelector("body");
    this.div = document.createElement("div");
  }

  render() {
    this.div.setAttribute("class", "overlay");
    this.div.setAttribute("id", "overlayMenu");
    this.div.innerHTML = this.menuTemplate();
    this.body.appendChild(this.div);
    this.addMenuListeners();
  }

  getOptions() {
    const storageItem =
      localStorage.getItem("options") ||
      JSON.stringify({
        playerName: "Player 1",
        scoreLimit: 30,
      });
    return JSON.parse(storageItem);
  }
  menuTemplate() {
    const { playerName, scoreLimit } = this.getOptions();
    return `
    <i id="closeMenuOverlay" class="closeResultOverlay" style="${
      !this.game.gameStarted ? "display:none;" : ""
    }">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
      </svg>
    </i>
    <section class="menu-container">
      <figure class="menu-ribbon-image-container">
        <img class="ribbon-image" src='${
          document.querySelector(`#menuRibbonImg`).src
        }' alt="ribbon">
      </figure>
      <div class="menu-items">
        <div>
          <i>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class=">
              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
            </svg>
          </i>
          <input type="text" id="playerName" name="playerName" value='${playerName}' />
        </div>
        <div>
          <input type="radio" id="limit30" name="scoreLimit" value='30' ${
            scoreLimit === 30 ? "checked" : ""
          } />
          <label for="limit30">30</label>
          <input type="radio" id="limit15" name="scoreLimit" value='15' ${
            scoreLimit === 15 ? "checked" : ""
          } />
          <label for="limit30">15</label>
        </div>
      </div>
      <div class="menu-buttons">
        <button id="newGame" class="btn-selector">Nuevo Juego</button>
      </div>
    </section>
    `;
  }

  addMenuListeners() {
    this.closeMenuOverlay = document.querySelector("#closeMenuOverlay");
    this.menuContainer = document.querySelector(".menu-container");
    this.menuListenerManager("addEventListener");
  }

  menuListenerManager(type) {
    this.closeMenuOverlay[type]("click", this.handleCloseMenu.bind(this), true);
    this.menuContainer[type]("click", this.handleMenuButtons.bind(this), true);
  }

  handleMenuButtons(ev) {
    const target = ev.target.closest(".btn-selector");
    if (!target) return;
    const id = target.id;
    switch (id) {
      case "newGame":
        this.handleNewGameAction();
        break;
      default:
        break;
    }
  }

  handleNewGameAction() {
    const playerName = document.querySelector("#playerName").value;
    const scoreLimit = +document.querySelector('[name="scoreLimit"]:checked')
      .value;
    localStorage.setItem("options", JSON.stringify({ playerName, scoreLimit }));
    this.removeOverlay();
    this.game.newGame({ playerName, scoreLimit });
  }

  handleCloseMenu() {
    this.removeOverlay();
  }

  removeOverlay() {
    this.menuListenerManager("removeEventListener");
    this.div.remove();
  }
}
