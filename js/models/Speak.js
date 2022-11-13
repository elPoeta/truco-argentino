export class Speek {
  constructor({ game }) {
    this.game = game;
    this.LANGUAGES = ['es-MX', 'es-US', 'es-ES', 'es_US', 'es_ES'];
    this.voices = [];
    this.voice = null;
    this.synth = new SpeechSynthesisUtterance();
    this.load();
    document.querySelector('#iaSpeeking').addEventListener('click', e => {
      const message = document.querySelector('#iaSpeeking').dataset.speech;
      if (message === '') return;
      this.speech(message);
    });
  }

  load() {
    this.loadVoices();
    speechSynthesis.onvoiceschanged = () => {
      this.loadVoices();
    };
  }

  loadVoices() {
    if (this.voices.length > 0) return;
    this.voices = speechSynthesis.getVoices();
    let index = this.voices.findIndex(voice => this.LANGUAGES.includes(voice.lang));
    if (index === -1) index = 0;
    this.voice = this.voices[index];
  };

  speech(message) {
    this.pause();
    this.stop();
    this.play(message);
  }

  play(message) {
    this.synth.voice = this.voice;
    this.synth.volume = 1;
    this.synth.rate = 1;
    this.synth.text = message;
    this.synth.pitch = 0.3;
    speechSynthesis.speak(this.synth);
  };

  stop() {
    speechSynthesis.cancel();
  }

  pause() {
    speechSynthesis.resume();
  }
}