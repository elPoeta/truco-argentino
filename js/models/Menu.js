import { Help } from "./Help.js";

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
        enableIAVoice: true,
      });
    return JSON.parse(storageItem);
  }
  menuTemplate() {
    const { playerName, scoreLimit, enableIAVoice } = this.getOptions();
    return `
    <i id="closeMenuOverlay" class="closeResultOverlay" style="${!this.game.gameStarted ? "display:none;" : ""
      }">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
      </svg>
    </i>
    <section class="menu-container">
      <figure class="menu-ribbon-image-container">
        <img class="ribbon-image" src='${document.querySelector(`#menuRibbonImg`).src
      }' alt="ribbon">
      </figure>
      <div class="menu-items-container">
        <div class="menu-items">
          <h3>Nombre</h3> 
          <input type="text" id="playerName" name="playerName" value='${playerName}' />
        </div>
        <div class="menu-items">
          <h3>Puntos</h3>
          <div class="menu-items-radio">
            <label class="radio-label">
              <input type="radio" id="limit30" name="scoreLimit" value='30' ${scoreLimit === 30 ? "checked" : ""
      } />30
	            <i></i>
            </label>
            <label class="radio-label">
              <input type="radio" id="limit15" name="scoreLimit" value='15' ${scoreLimit === 15 ? "checked" : ""
      } />15
              <i></i>
            </label>
          </div>
        </div>
        <div class="menu-items">
          <h3>IA voz</h3>
          <i id="voiceIAIcon" class="btn-selector" data-enablevoice="${enableIAVoice}">
           ${this.getSoundIcon(enableIAVoice)}
          </i>
        </div>
        <div class="menu-items">
          <button id="newGame" class="btn btn-selector">
            <span class="btn-content">Nuevo Juego</span>
          </button>
        </div>
        <div class="help-container">
          <i id="helpIcon" class="btn-selector" >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="menu-item-svg">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
            </svg>
          </i>
        </div>        
      </div>
    </section>
    `;
  }

  getSoundIcon(enableIAVoice) {
    if (enableIAVoice) {
      return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="menu-item-svg">
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
      </svg>`;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="menu-item-svg">
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
      </svg>`;
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
      case "voiceIAIcon":
        this.handleIAVoice();
        break;
      case "helpIcon":
        this.handleHelp();
        break;
      default:
        break;
    }
  }

  handleIAVoice() {
    const voiceIcon = document.querySelector("#voiceIAIcon");
    const dataVoice = voiceIcon.dataset.enablevoice == "true";
    voiceIcon.dataset.enablevoice = !dataVoice;
    voiceIcon.innerHTML = this.getSoundIcon(!dataVoice);
  }

  handleHelp() {
    const help = new Help();
    help.show();
  }

  handleNewGameAction() {
    const playerName = document.querySelector("#playerName").value;
    const scoreLimit = +document.querySelector('[name="scoreLimit"]:checked')
      .value;
    const enableIAVoice =
      document.querySelector("#voiceIAIcon").dataset.enablevoice == "true";
    localStorage.setItem(
      "options",
      JSON.stringify({ playerName, scoreLimit, enableIAVoice })
    );
    this.removeOverlay();
    this.game.newGame({ playerName, scoreLimit, enableIAVoice });
  }

  handleCloseMenu() {
    this.removeOverlay();
  }

  removeOverlay() {
    this.menuListenerManager("removeEventListener");
    this.div.remove();
  }
}
