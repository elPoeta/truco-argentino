export class Help {
  constructor() {
    this.body = document.querySelector("body");
    this.div = document.createElement("div");
  }

  show() {
    this.div.setAttribute("class", "overlay");
    this.div.setAttribute("id", "overlayHelp");
    this.div.innerHTML = this.template();
    this.body.appendChild(this.div);
    this.addSelectors();
  }

  template() {
    return `
   <i id="closeHelpOverlay" class="closeResultOverlay" >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
      <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
    </svg>
  </i>
  <div class="help-container">
    <input id="tab1" type="radio" name="tabs" checked>
    <label for="tab1">Teclado</label>
    <input id="tab2" type="radio" name="tabs">
    <label for="tab2">Voz</label>
    <input id="tab3" type="radio" name="tabs">
    <label for="tab3">Reglas</label>
    <section id="keyboardContent" class="help-content">
      <h2>Controles de teclado</h2>
      <hr class="result-divide-line" style="margin: 10px 0;"/>
      <p>Envido: <span>F1</span></p>
      <p>Real Envido: <span>F2</span></p>
      <p>Falta Envido: <span>F3</span></p>
      <p>Truco: <span>F4</span></p>
      <p>Quiero Re-Truco: <span>F5</span></p>
      <p>Quiero Vale 4: <span>F6</span></p>
      <p>Quiero: <span>F7</span></p>
      <p>No Quiero: <span>F8</span></p>
      <p>Me Voy Al Mazo: <span>F9</span></p>
      <p>Fullscreen: <span>F11</span></p>
      <p>Menu: <span>Esc</span></p>
      <p>Comando de voz: <span>Barra espaciadora</span></p>
      <p>Carta 1: <span>1</span></p>
      <p>Carta 2: <span>2</span></p>
      <p>Carta 3: <span>3</span></p>
    </section>
    <section id="voiceCommandContent" class="help-content">
      <h2>Controles de voz</h2>
      <hr class="result-divide-line" style="margin: 10px 0;"/>
      <p>Envido: <span>Envido</span></p>
      <p>Real Envido: <span>Real Envido</span></p>
      <p>Falta Envido: <span>Falta Envido</span></p>
      <p>Truco: <span>Truco</span></p>
      <p>Quiero Re-Truco: <span>Quiero Retruco </span></p>
      <p>Quiero Vale 4: <span>Quiero Vale 4</span></p>
      <p>Quiero: <span>Quiero</span></p>
      <p>No Quiero: <span>No Quiero</span></p>
      <p>Me Voy Al Mazo: <span>Me Voy Al Mazo</span></p>
      <p>Carta 1: <span>Jugar Carta 1</span></p>
      <p>Carta 2: <span>Jugar Carta 2</span></p>
      <p>Carta 3: <span>Jugar Carta 3</span></p>
    </section>
    <section id="reglamentoContent" class="help-content">
      <iframe
        src="https://asart.com.ar/wp-content/uploads/reglamento/reglamento-oficial-asart.pdf#toolbar=0&navpanes=0&scrollbar=0"
        frameBorder="0"
        scrolling="auto"
        height="100%"
        width="100%"
      ></iframe>
    </section>
  </div>
  `;
  }

  addSelectors() {
    this.close = document.querySelector("#closeHelpOverlay");
    this.listenerManager("addEventListener");
  }

  listenerManager(type) {
    this.close[type]("click", this.handleClose.bind(this), true);
  }

  handleClose() {
    this.listenerManager("removeEventListener");
    this.div.remove();
  }
}
