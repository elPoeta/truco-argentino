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

  menuTemplate() {
    return `
    <section class="menu-container">
      <figure class="menu-ribbon-image-container">
        <img class="ribbon-image" src='${
          document.querySelector(`#menuRibbonImg`).src
        }' alt="ribbon">
      </figure>
      <div class="menu-items">
      </div>
      <div class="menu-buttons">
        <button id="newGame" class="btn-selector">Nuevo Juego</button>
      </div>
    </section>
    `;
  }

  addMenuListeners() {
    this.menuContainer = document.querySelector(".menu-container");
    this.menuListenerManager("addEventListener");
  }

  menuListenerManager(type) {
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
    this.removeOverlay();
    this.game.newGame({ playerName: "Leo" });
  }

  removeOverlay() {
    this.menuListenerManager("removeEventListener");
    this.div.remove();
  }
}
