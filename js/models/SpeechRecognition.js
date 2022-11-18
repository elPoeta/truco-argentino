import { Action } from "./Action.js";

export class SpeechRecognition {
  constructor({ game }) {
    this.game = game;
    this.commandVoice = document.querySelector("#commandVoice");
    this.words = [
      "envido",
      "real envido",
      "falta envido",
      "truco",
      "quiero retruco",
      "quiero vale cuatro",
      "quiero vale 4",
      "quiero",
      "no quiero",
      "me voy al mazo",
    ];
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
    if (this.words.includes(transcript)) {
      this.logMessage(transcript);
    } else {
      this.logMessage("comando de voz invalido");
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d97706" class="panel-svg-icon">
          <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
          <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
        </svg>`;
    } else {
      return `
        <svg fill="#d97706" class="panel-svg-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="36px" height="36px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet">
          <title>microphone mute</title>
          <path d="M30,17h-2c0,1.8-0.5,3.5-1.4,5l1.5,1.5C29.3,21.5,29.9,19.3,30,17z" class="clr-i-solid clr-i-solid-path-1"/>
          <path d="M25,17V9c0-3.9-3.2-7-7.1-6.9c-2.9,0-5.6,1.9-6.5,4.7l13,13C24.8,18.9,25,17.9,25,17z" class="clr-i-solid clr-i-solid-path-2"/>
          <path d="M25.2,26.6l6.9,6.9l1.4-1.4L4,2.6L2.6,4l8.4,8.4V17c0,3.9,3.1,7,7,7c1.3,0,2.5-0.3,3.6-1l2.2,2.2C22.1,26.4,20.1,27,18,27   c-5.4,0.2-9.8-4.1-10-9.4c0-0.2,0-0.4,0-0.6H6c0.1,6.2,4.8,11.4,11,12v3h-3c-0.6,0-1,0.4-1,1s0.4,1,1,1h8c0.6,0,1-0.4,1-1   s-0.4-1-1-1h-3v-3C21.2,28.8,23.4,28,25.2,26.6z" class="clr-i-solid clr-i-solid-path-3"/>
          <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>
        </svg>`;
    }
  }
}
