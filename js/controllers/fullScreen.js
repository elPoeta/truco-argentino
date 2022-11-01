export class Fullscreen {
  handleFullscreen(callback) {
    const fullscreenElement =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement;
    if (fullscreenElement) {
      this.exitFullscreen();
    } else {
      this.launchFullscreen(callback);
    }
  }

  async launchFullscreen(callback) {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      await document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      await document.documentElement.webkitRequestFullscreen();
    }
    if (callback) callback();
  }

  async exitFullscreen() {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      await document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      await document.webkitExitFullscreen();
    }
  }
}
