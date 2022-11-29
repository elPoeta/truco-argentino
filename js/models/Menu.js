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
        withFlor: false,
      });
    return JSON.parse(storageItem);
  }
  menuTemplate() {
    const { playerName, scoreLimit, enableIAVoice, withFlor } =
      this.getOptions();
    return `
    <i id="closeMenuOverlay" class="closeResultOverlay" style="${
      !this.game.gameStarted ? "display:none;" : ""
    }">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
      </svg>
    </i>
    <section class="menu-container">
      <div class="menu-title">
        <div class="lines"></div>
        <h1>
          <span>TRUCO</span>
          <span>TRUCO</span>
        </h1>
        <h2>argentino</h2>
      </div>
      <div class="menu-items-container">
        <div class="menu-items">
          <h3>Nombre</h3> 
          <input type="text" id="playerName" name="playerName" value='${playerName}' />
        </div>
        <div class="menu-items">
          <h3>Puntos</h3>
          <div class="menu-items-radio">
            <label class="radio-label">
              <input type="radio" id="limit30" name="scoreLimit" value='30' ${
                scoreLimit === 30 ? "checked" : ""
              } />30
	            <i></i>
            </label>
            <label class="radio-label">
              <input type="radio" id="limit15" name="scoreLimit" value='15' ${
                scoreLimit === 15 ? "checked" : ""
              } />15
              <i></i>
            </label>
          </div>
        </div>
        <div class="menu-items">
          <h3>Con Flor</h3>
          <div class="menu-items-radio" style="align-items:center;">
            <i>
              ${this.getFlowerIcon()}
            </i>  
            <label class="radio-label">
              <input type="checkbox" id="withFlower" name="withFlower" ${
                withFlor ? "checked" : ""
              }  />
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
            <span class="btn-content" style="color:#59c1fe;">Nuevo Juego</span>
          </button>
        </div>
        <div class="help-icon-container">
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

  getFlowerIcon() {
    return `<svg style="height: fit-content;stroke-width: 5px;" class="menu-item-svg" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      width="125.463px" height="125.463px" viewBox="0 0 125.463 125.463"xml:space="preserve">
   <g>
     <path d="M59.896,88.798c0.294-3.066,0.592-5.564,0.886-6.912c0.76-3.528,1.423-6.701,1.844-9.445
     c5.485-0.339,9.846-4.856,9.846-10.417c0-0.683-0.059-1.408-0.186-2.163c0.336,0.414,0.668,0.849,1.01,1.189
     c4.097,4.088,10.742,4.088,14.835,0c3.967-3.961,4.059-10.272,0.366-14.396c5.678-0.13,10.249-4.764,10.249-10.469
     c0-5.788-4.712-10.489-10.492-10.489c-0.472,0-0.954,0.053-1.444,0.099c0.268-0.228,0.582-0.458,0.812-0.691
     c4.11-4.093,4.11-10.737,0-14.844c-4.093-4.093-10.742-4.093-14.835,0c-0.314,0.312-0.609,0.722-0.91,1.11
     c0.021-0.291,0.041-0.602,0.041-0.883C71.917,4.693,67.222,0,61.428,0c-5.604,0-10.125,4.399-10.436,9.91
     c-4.115-3.809-10.523-3.749-14.529,0.26c-4.09,4.096-4.09,10.741,0,14.84c0.462,0.452,1.016,0.896,1.579,1.324
     c-0.441-0.049-0.886-0.084-1.314-0.084c-5.795,0-10.487,4.695-10.487,10.496c0,5.758,4.649,10.436,10.4,10.48
     c-3.973,4.108-3.953,10.649,0.109,14.708c4.064,4.067,10.634,4.085,14.739,0.074c0,0.01,0,0.017,0,0.017
     c0,4.843,3.318,8.895,7.786,10.096c-0.402,2.598-1.044,5.653-1.776,9.072c-0.933,4.353-1.962,9.175-2.625,13.952
     c-0.021-0.072-0.021-0.137-0.046-0.223c-3.889-13.641-20.856-18.713-28.707-10.862c6.528,10.753,13.6,18.258,28.051,18.258
     c-0.063,1.488-0.048,21.001,0.046,23.144h3.368c0.214-5.51,0.789-16.717,1.472-26.539c0-0.075,0-0.146,0-0.222
     c0.039-0.048,0.074-0.082,0.116-0.13c6.08-6.779,13.68-13.449,22.434-15.77c-5.79,2.142-12.614,6.434-20.742,17.145
     c-0.512,0.678-0.963,1.287-1.36,1.824c19.966,0,30.651-10.119,39.835-25.711C89.253,65.969,66.742,70.935,59.896,88.798z
      M54.191,102.008c-3.869-5.493-9.125-10.913-15.475-13.183c3.97,1.048,8.949,3.505,15.632,10.886
     C54.289,100.481,54.226,101.248,54.191,102.008z M53.032,36.179c0-5.046,4.1-9.156,9.153-9.156c5.044,0,9.15,4.11,9.15,9.156
     c0,5.043-4.106,9.156-9.15,9.156C57.131,45.335,53.032,41.222,53.032,36.179z"/>
   </g>
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
    const withFlor = document.querySelector("#withFlower").checked;
    localStorage.setItem(
      "options",
      JSON.stringify({ playerName, scoreLimit, enableIAVoice, withFlor })
    );
    this.removeOverlay();
    this.game.newGame({ playerName, scoreLimit, enableIAVoice, withFlor });
  }

  handleCloseMenu() {
    this.removeOverlay();
  }

  removeOverlay() {
    this.menuListenerManager("removeEventListener");
    this.div.remove();
  }
}
