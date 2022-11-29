import { Action } from "./Action.js";
import { InputHandler } from "../controllers/InputHandler.js";
export class SpeechRecognition extends InputHandler {
  constructor({ game }) {
    super({ game });
    this.commandVoice = document.querySelector("#commandVoice");
    this.words = [
      "envido",
      "real envido",
      "falta envido",
      "flor",
      "contra flor",
      "contra flor al resto",
      "con flor quiero",
      "con flor me achico",
      "truco",
      "quiero retruco",
      "quiero vale cuatro",
      "quiero vale 4",
      "quiero",
      "no quiero",
      "me voy al mazo",
      "jugar carta 1",
      "jugar carta 2",
      "jugar carta 3",
      "jugar carta uno",
      "jugar carta dos",
      "jugar carta tres",
    ];
    this.commands = {
      envido: Action.ENVIDO,
      "real envido": Action.REAL_ENVIDO,
      "falta envido": Action.FALTA_ENVIDO,
      flor: Action.FLOR,
      "contra flor": Action.CONTRA_FLOR,
      "contra flor al resto": Action.CONTRA_FLOR_AL_RESTO,
      "con flor quiero": Action.CON_FLOR_QUIERO,
      "con flor me achico": Action.CON_FLOR_ME_ACHICO,
      truco: Action.TRUCO,
      "quiero retruco": Action.RE_TRUCO,
      "quiero vale cuatro": Action.VALE_4,
      "quiero vale 4": Action.VALE_4,
      quiero: Action.QUIERO,
      "no quiero": Action.NO_QUIERO,
      "me voy al mazo": Action.MAZO,
      "jugar carta 1": 1,
      "jugar carta 2": 2,
      "jugar carta 3": 3,
      "jugar carta uno": 1,
      "jugar carta dos": 2,
      "jugar carta tres": 3,
    };
  }

  run() {
    if (this.commandVoice.dataset.mic === "locked") return;

    const recognition = new window.webkitSpeechRecognition();

    recognition.addEventListener("start", (ev) => {
      this.commandVoice.innerHTML = this.microphoneSvg("locked");
      this.commandVoice.dataset.mic = "locked";
    });

    recognition.addEventListener("result", (ev) => {
      const transcript = Array.from(ev.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      this.handleTranscription(transcript);
    });

    recognition.addEventListener("speechend", (ev) => {
      this.commandVoice.innerHTML = this.microphoneSvg("unlocked");
      this.commandVoice.dataset.mic = "unlocked";
    });

    recognition.addEventListener("error", (ev) => {
      this.commandVoice.innerHTML = this.microphoneSvg("unlocked");
      this.commandVoice.dataset.mic = "unlocked";
    });

    recognition.start();
  }

  handleTranscription(transcript) {
    transcript = transcript.toLowerCase();
    this.logMessage(transcript);
    if (this.words.includes(transcript)) {
      this.handleCommand(this.commands[transcript]);
    } else {
      setTimeout(() => {
        this.logMessage("comando de voz invalido");
      }, 600);
    }
  }

  handleCommand(command) {
    switch (command) {
      case 1:
      case 2:
      case 3:
        this.handlePlayCardsAction(command);
        break;
      case Action.ENVIDO:
        if (this.isNotEnableButton("envido")) break;
        this.handleEnvidoActions({ dataEnvido: Action.ENVIDO });
        break;
      case Action.REAL_ENVIDO:
        if (this.isNotEnableButton("realEnvido")) break;
        this.handleEnvidoActions({ dataEnvido: Action.REAL_ENVIDO });
        break;
      case Action.FALTA_ENVIDO:
        if (this.isNotEnableButton("faltaEnvido")) break;
        this.handleEnvidoActions({ dataEnvido: Action.FALTA_ENVIDO });
        break;
      case Action.FLOR:
        if (this.isNotEnableButton("flor")) break;
        this.handleFlorActions({ dataFlor: Action.FLOR });
        break;
      case Action.CONTRA_FLOR:
        if (this.isNotEnableButton("contraFlor")) break;
        this.handleFlorActions({ dataFlor: Action.CONTRA_FLOR });
        break;
      case Action.CONTRA_FLOR_AL_RESTO:
        if (this.isNotEnableButton("contraFlorAlResto")) break;
        this.handleFlorActions({ dataFlor: Action.CONTRA_FLOR_AL_RESTO });
        break;
      case Action.CON_FLOR_QUIERO:
        if (this.isNotEnableButton("conFlorQuiero")) break;
        this.handleFlorActions({ dataFlor: Action.CON_FLOR_QUIERO });
        break;
      case Action.CON_FLOR_ME_ACHICO:
        if (this.isNotEnableButton("conFlorMeAchico")) break;
        this.handleFlorActions({ dataFlor: Action.CON_FLOR_ME_ACHICO });
        break;
      case Action.TRUCO:
        if (this.isNotEnableButton("truco")) break;
        this.handleTrucoActions({ dataTruco: Action.TRUCO });
        break;
      case Action.RE_TRUCO:
        if (this.isNotEnableButton("reTruco")) break;
        this.handleTrucoActions({ dataTruco: Action.RE_TRUCO });
        break;
      case Action.VALE_4:
        if (this.isNotEnableButton("vale4")) break;
        this.handleTrucoActions({ dataTruco: Action.VALE_4 });
        break;
      case Action.QUIERO:
        if (this.isNotEnableButton("response-buttons")) break;
        this.handleResponseActions({ dataResponse: Action.QUIERO });
        break;
      case Action.NO_QUIERO:
        if (this.isNotEnableButton("response-buttons")) break;
        this.handleResponseActions({ dataResponse: Action.NO_QUIERO });
        break;
      case Action.MAZO:
        this.handleMazoAction();
        break;
      default:
        break;
    }
  }

  logMessage(message) {
    this.game.logMessage.show({
      player: Action.HUMAN,
      action: message,
    });
  }

  microphoneSvg(type) {
    if (type === "unlocked") {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#59c1fe" class="panel-svg-icon">
          <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
          <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
        </svg>`;
    } else {
      return `
        <svg fill="#59c1fe" class="panel-svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 488.9 488.9" style="enable-background:new 0 0 488.9 488.9;" xml:space="preserve">
          <g>
            <g>
              <path d="M243.9,0c-51,0-92.6,41.6-92.6,92.6v189.3c0,43.8,30.8,80.7,71.8,90.2v75.2H195c-11.4,0-20.8,9.4-20.8,20.8    s9.4,20.8,20.8,20.8h97.8c11.4,0,20.8-9.4,20.8-20.8s-9.4-20.8-20.8-20.8h-28.1v-75.2c41-9.5,71.8-46.4,71.8-90.2V92.6    C336.5,41.6,294.9,0,243.9,0z M295.9,282c0,29.1-22.9,52-52,52s-52-22.9-52-52V92.6c0-29.1,22.9-52,52-52s52,23.9,52,52V282z"/>
              <path d="M450.9,91.6c-8.3-8.3-20.8-8.3-29.1-1c-8.3,8.3-8.3,20.8-1,29.1c35.4,37.5,35.4,98.8,0,136.3c-7.3,8.3-7.3,21.8,1,29.1    c3.1,3.1,15.4,10.2,29.1-1C500.8,231,500.8,144.6,450.9,91.6z"/>
              <path d="M407.2,133.2c-8.3-8.3-20.8-8.3-29.1-1c-8.3,8.3-8.3,20.8-1,29.1c13.5,14.6,13.5,37.5,0,52c-7.3,8.3-7.3,21.8,1,29.1    c3.1,3.1,15.7,10.6,29.1-1C435.3,211.2,435.3,163.4,407.2,133.2z"/>
              <path d="M68.1,119.7c7.3-8.3,7.3-20.8-1-29.1c-8.3-7.3-20.8-7.3-29.1,1c-49.9,53.1-49.9,139.4,0,192.5c13.8,11.2,26,4.2,29.1,1    c8.3-7.3,8.3-20.8,1-29.1C32.7,218.5,32.7,157.1,68.1,119.7z"/>
              <path d="M110.7,132.1c-8.3-7.3-20.8-7.3-29.1,1c-28.1,30.2-28.1,78,0,108.2c13.4,11.6,26,4.2,29.1,1c8.3-7.3,8.3-20.8,1-29.1    c-13.5-14.6-13.5-37.5,0-52C119,153,119,140.5,110.7,132.1z"/>
            </g>
          </g>
        </svg>`;
    }
  }
}
