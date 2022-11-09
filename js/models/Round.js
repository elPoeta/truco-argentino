import { getRandomInt } from "../utils/gameHelper.js";
import { Deck } from "./Deck.js";
import { Human } from "./Human.js";
import { IA } from "./IA.js";
import {
  POS_CARD_1,
  POS_CARD_2,
  POS_CARD_3,
  TOP_CARD_Y,
  BOTTOM_CARD_Y,
} from "../utils/helpers.js";
import { Action } from "./Action.js";
export class Round {
  constructor({ game }) {
    this.game = game;
    this.deck = new Deck({ game });
    this.init();
  }

  init() {
    this.numberOfHands = 0;
    this.playsOnHands = 0;
    this.playerTurn = null;
    this.waiting = false;

    this.canEnvido = true;
    this.chants = [];
    this.playerEnvido = null;
    this.whoSang = [];
    this.envidoStatsFlag = true;
    this.savedPoints = null;

    this.playerTruco = null;
    this.canTruco = null;
    this.playerDoesNotWant = null;
    this.truco = [];
    this.currentResponse = null;
    this.humanCanPlayCard = false;
  }

  changeHand() {
    if (this.game.humanPlayer.itIsHand) {
      this.game.IAPlayer.itIsHand = true;
      this.game.IAPlayer.hisTurn = false;
      this.game.humanPlayer.itIsHand = false;
      this.game.humanPlayer.hisTurn = true;
    } else {
      this.game.humanPlayer.itIsHand = true;
      this.game.humanPlayer.hisTurn = false;
      this.game.IAPlayer.itIsHand = false;
      this.game.IAPlayer.hisTurn = true;
    }
  }

  waitingPlayer(player) {
    if (player instanceof Human) {
      return this.game.IAPlayer;
    } else if (player instanceof IA) {
      return this.game.humanPlayer;
    } else {
      return null;
    }
  }

  swapTurn() {
    //console.log("SWAP-TURN ", JSON.stringify(this.playerTurn.name));
    if (this.playerTurn instanceof Human) {
      this.playerTurn = this.game.IAPlayer;
    } else {
      this.playerTurn = this.game.humanPlayer;
    }
    this.playsOnHands++;
  }

  start() {
    this.game.humanPlayer.hands = 0;
    this.game.humanPlayer.envidoWinnerPoints = 0;
    this.game.IAPlayer.hands = 0;
    this.game.IAPlayer.strategyGame = null;
    this.game.IAPlayer.envidoWinnerPoints = 0;

    this.dealCards();

    if (this.game.humanPlayer.itIsHand) {
      this.game.humanPlayer.hisTurn = true;
      this.playerTurn = this.game.humanPlayer;
    } else {
      this.game.IAPlayer.hisTurn = true;
      this.playerTurn = this.game.IAPlayer;
    }
    this.continue();
  }

  dealCards() {
    this.game.humanPlayer.removeAllCards();
    this.game.IAPlayer.removeAllCards();
    let handPlayer = this.game.humanPlayer;
    let player = this.game.IAPlayer;
    if (this.game.IAPlayer.itIsHand) {
      handPlayer = this.game.IAPlayer;
      player = this.game.humanPlayer;
    }

    const roundDeck = this.deck.generate();
    let count = 1;
    for (let i = 1; i <= 6; i++) {
      const index = getRandomInt(0, roundDeck.length - 1);
      const card = roundDeck[index];
      const { x, y } = this.getCardCoords(handPlayer, player, count, i);
      card.x = x;
      card.y = y;
      if (i % 2 === 0) {
        handPlayer.cards.push(card);
        if (handPlayer instanceof Human) {
          handPlayer.cardsInHand.push(card);
        } else {
          handPlayer.cardsInHandHidden.push(card);
        }
        count++;
      } else {
        player.cards.push(card);
        if (player instanceof Human) {
          player.cardsInHand.push(card);
        } else {
          player.cardsInHandHidden.push(card);
        }
      }
      roundDeck.splice(index, 1);
    }
  }

  getCardCoords(handPlayer, player, count, i) {
    let y = TOP_CARD_Y;
    if (i % 2 === 0) {
      if (handPlayer instanceof Human) y = BOTTOM_CARD_Y;
    } else {
      if (player instanceof Human) y = BOTTOM_CARD_Y;
    }
    switch (count) {
      case 1:
        return { x: POS_CARD_1, y };
      case 2:
        return { x: POS_CARD_2, y };
      default:
        return { x: POS_CARD_3, y };
    }
  }

  // continue(playerWinner) {
  //   console.log("HAND-NUMBER ", this.numberOfHands);
  //   if (!playerWinner) {
  //     if (this.playsOnHands === 2 || this.playerDoesNotWant != null) {
  //       if (this.playsOnHands === 2) {
  //         this.canEnvido = false;
  //         this.playsOnHands = 0;
  //         this.playerTurn = this.winningHand(this.numberOfHands);
  //       }
  //       playerWinner = this.winningRound();
  //       this.numberOfHands++;
  //       if (this.numberOfHands === 3 || playerWinner !== null) {
  //         this.checkWinner(playerWinner);
  //         return;
  //       }
  //     }

  //     if (this.playerEnvido === null && this.playerTruco === null) {
  //       this.chooseCard();
  //     } else if (this.playerEnvido !== null) {
  //       this.envidoResponse();
  //     } else {
  //       this.trucoResponse();
  //     }
  //   }

  //   if (playerWinner) {
  //     // TODO
  //     console.log("WINNER ", playerWinner);
  //     this.checkWinner(playerWinner);
  //   }
  // }

  continue(playerWinner) {
    //console.log("HAND-NUMBER ", this.numberOfHands);
    while (!playerWinner) {
      if (this.playsOnHands === 2 || this.playerDoesNotWant != null) {
        if (this.playsOnHands === 2) {
          this.canEnvido = false;
          this.playsOnHands = 0;
          this.playerTurn = this.winningHand(this.numberOfHands);
        }
        playerWinner = this.winningRound();
        this.numberOfHands++;
        if (this.numberOfHands === 3 || playerWinner !== null) {
          break;
        }
      }

      if (this.playerEnvido === null && this.playerTruco === null)
        this.chooseCard();
      else if (this.playerEnvido !== null) this.envidoResponse();
      else this.trucoResponse();

      if (this.waiting === true) break;
    }
    if (playerWinner) {
      // TODO
      //console.log("WINNER ", playerWinner);
    }
  }

  winningHand(index, pointsAccumulate) {
    if (pointsAccumulate == undefined || pointsAccumulate == null) {
      pointsAccumulate = true;
    }
    if (
      this.game.humanPlayer.playedCards[index].value >
      this.game.IAPlayer.playedCards[index].value
    ) {
      if (pointsAccumulate) {
        this.game.humanPlayer.hands += 1;
      }
      console.log("GANA MANO ", this.game.humanPlayer.name);
      // Deberíamos buscar una forma mas elegante

      return this.game.humanPlayer;
    } else {
      if (
        this.game.humanPlayer.playedCards[index].value <
        this.game.IAPlayer.playedCards[index].value
      ) {
        if (pointsAccumulate) {
          this.game.IAPlayer.hands += 1;
        }
        // Deberíamos buscar una forma mas elegante
        console.log("GANA MANO ", this.game.IAPlayer.name);
        return this.game.IAPlayer;
      } else {
        if (pointsAccumulate) {
          this.game.humanPlayer.hands += 1;
          this.game.IAPlayer.hands += 1;
        }
        console.log("PARDA");
        if (this.game.humanPlayer.itIsHand) {
          return this.game.humanPlayer;
        } else {
          return this.game.IAPlayer;
        }
      }
    }
  }

  winningRound() {}

  checkWinner(playerWinner) {}

  chooseCard() {
    console.log("CHOOSE ", this.playerTurn);
    if (!this.playerTurn) {
      this.waiting = true;
      console.log("FAIL ", this.playerTruco);
      return;
    }
    if (this.playerTurn instanceof Human) {
      //console.log("Humano choose card");
      this.waiting = true;
      if (this.canEnvido) {
        this.humanCanSayEnvido();
      }
      if (this.canTruco === null || this.canTruco === this.playerTurn) {
        this.humanCanSayTruco();
      }
    } else {
      console.log("IA play choose");
      if (this.canEnvido) {
        if (this.IACanSayEnvido()) return;
      }
      if (this.canTruco === null || this.canTruco === this.playerTurn) {
        if (this.IACanSayTruco()) return;
      }
      this.IACanPlayCard();
    }
  }

  humanCanSayEnvido() {
    const envidoButtons = document.querySelector("#envido-buttons");
    envidoButtons.querySelectorAll("button").forEach((button) => {
      if (button.classList.contains("hide")) button.classList.remove("hide");
    });
  }

  IACanSayEnvido() {
    const len = this.game.humanPlayer.playedCards.length;
    const card = this.game.humanPlayer.playedCards[len - 1];
    const { winner } = this.calculateEnvidoPoints();
    let action = this.game.IAPlayer.envido({
      lastSang: this.chants.length[this.chants.length - 1],
      pointsAccumulate: winner,
      lastCard: card,
    });
    if (action === "") return false;
    this.canEnvido = false;
    this.game.logMessage.show({
      player: Action.IA,
      action,
    });
    this.currentResponse = Action.ENVIDO;
    this.chants.push(action);
    this.whoSang.push(Action.IA);
    // this.playerEnvido = this.waitingPlayer(this.playerTurn);
    this.playerEnvido = this.waitingPlayer(this.game.IAPlayer);
    //log
    return true;
  }

  envidoResponse() {
    // console.log("ENVIDO-response", this.playerEnvido);
    if (this.playerEnvido instanceof Human) {
      this.humanEnvidoResponse();
    } else {
      this.IAEnvidoResponse();
    }
  }

  humanEnvidoResponse() {
    //console.log("CHANTS ", this.chants);
    const lastSang = this.chants.length[this.chants.length - 1];
    const envidoButtons = document.querySelector("#envido-buttons");
    const responseButtons = document.querySelector("#response-buttons");
    responseButtons.classList.remove("hide");
    this.currentResponse = Action.ENVIDO;
    switch (lastSang) {
      case Action.ENVIDO:
        envidoButtons.querySelector("#envido").classList.remove("hide");
      case Action.ENVIDO_ENVIDO:
        envidoButtons.querySelector("#realEnvido").classList.remove("hide");
      case Action.REAL_ENVIDO:
        envidoButtons.querySelector("#faltaEnvido").classList.remove("hide");
    }
    this.waiting = true;
  }

  IAEnvidoResponse() {
    const card = this.game.humanPlayer.cardsInHand.getLast();
    const { winner } = this.calculateEnvidoPoints();
    let action = this.game.IAPlayer.envido({
      lastSang: this.chants.getLast(),
      pointsAccumulate: winner,
      lastCard: card,
    });

    if (action !== "") {
      this.game.logMessage.show({
        player: Action.IA,
        action,
      });
      if (action === Action.QUIERO || action === Action.NO_QUIERO) {
        this.playEnvido(action === Action.QUIERO);
      } else {
        this.chants.push(action);
        this.currentResponse = Action.ENVIDO;
        this.whoSang.push(Action.IA);
        this.playerEnvido = this.waitingPlayer(this.game.IAPlayer);
      }
    }
  }

  calculateEnvidoPoints() {
    let winner = 0;
    let loser = 0;
    for (const c in this.chants) {
      switch (this.chants[c]) {
        case Action.ENVIDO:
          winner += 2;
          loser += 1;
          break;
        case Action.ENVIDO_ENVIDO:
          winner += 2;
          loser += 1;
          break;
        case Action.REAL_ENVIDO:
          winner += 3;
          loser += 1;
          break;
        case Action.FALTA_ENVIDO:
          winner =
            this.game.scoreLimit -
            (this.game.humanPlayer.score < this.game.IAPlayer.score
              ? this.game.IAPlayer.score
              : this.game.humanPlayer.score);
          loser += 1;
          break;
      }
    }
    return { winner, loser };
  }

  playEnvido(action) {
    const points = this.calculateEnvidoPoints();
    let first;
    let second;
    let envidoPoints1;
    let envidoPoints2;
    if (action) {
      if (this.game.humanPlayer.itIsHand) {
        first = this.game.humanPlayer;
        envidoPoints1 = first.getEnvidoPoints(first.cards);
        second = this.game.IAPlayer;
        envidoPoints2 = second.getEnvidoPoints(second.cards);
      } else {
        first = this.game.IAPlayer;
        envidoPoints1 = first.getEnvidoPoints(first.cards);
        second = this.game.humanPlayer;
        envidoPoints2 = second.getEnvidoPoints(second.cards);
      }

      this.game.logMessage.show({
        player: first instanceof Human ? Action.HUMAN : Action.IA,
        action: envidoPoints1,
      });
      this.game.logMessage.show({
        player: second instanceof Human ? Action.HUMAN : Action.IA,
        action: envidoPoints2,
      });

      if (this.envidoStatsFlag && first instanceof Human) {
        this.game.IAPlayer.statsEnvido(
          this.chants,
          this.whoSang,
          envidoPoints1
        );
        this.savedPoints = envidoPoints1;
        this.envidoStatsFlag = false;
      }

      if (envidoPoints2 > envidoPoints1) {
        if (this.envidoStatsFlag && second instanceof Human) {
          this.game.IAPlayer.statsEnvido(
            this.chants,
            this.whoSang,
            envidoPoints2
          );
          this.savedPoints = envidoPoints2;
          this.envidoStatsFlag = false;
        }
        second.envidoWinnerPoints = points.winner;
        second.score += points.winner;
      } else {
        first.score += points.winner;
        first.envidoWinnerPoints = points.winner;
      }
    } else {
      const winner = this.waitingPlayer(this.playerEnvido);
      winner.score += points.loser;
      winner.envidoWinnerPoints = points.loser;
    }
    this.canEnvido = false;
    this.playerEnvido = null;
  }

  humanCanSayTruco() {
    const lastSang = !this.truco.length
      ? ""
      : this.truco[this.truco.length - 1];
    const trucoButtons = document.querySelector("#truco-buttons");
    this.currentResponse = Action.TRUCO;
    switch (lastSang) {
      case Action.TRUCO:
        trucoButtons.querySelector("#reTruco").classList.remove("hide");
        break;
      case Action.RE_TRUCO:
        trucoButtons.querySelector("#vale4").classList.remove("hide");
        break;
      case Action.VALE_4:
        break;
      default:
        trucoButtons.querySelector("#truco").classList.remove("hide");
        break;
    }
  }

  IACanSayTruco() {
    const lastSang = !this.truco.length
      ? ""
      : this.truco[this.truco.length - 1];
    const IASang = this.game.IAPlayer.truco({ response: false, lastSang });
    if (IASang !== "") {
      console.log("IA CAN SAY TRUCO SANG", IASang);
      this.game.logMessage.show({
        player: Action.IA,
        action: IASang,
      });
      this.truco.push(IASang);
      this.currentResponse = Action.TRUCO;
      //this.playerTruco = this.waitingPlayer(this.playerTurn);
      //this.canTruco = this.waitingPlayer(this.playerTurn);
      this.playerTruco = this.waitingPlayer(this.game.IAPlayer);
      this.canTruco = this.waitingPlayer(this.game.IAPlayer);
      return true;
    }
    return false;
  }

  trucoResponse() {
    const lastSang = !this.truco.length
      ? ""
      : this.truco[this.truco.length - 1];
    //console.log("!!! RESP TRUCO ", lastSang);
    if (this.playerTruco instanceof Human) {
      const trucoButtons = document.querySelector("#truco-buttons");
      trucoButtons
        .querySelectorAll("button")
        .forEach((button) => button.classList.add("hide"));
      const responseButtons = document.querySelector("#response-buttons");
      responseButtons.classList.remove("hide");
      this.currentResponse = Action.TRUCO;
      switch (lastSang) {
        case Action.truco:
          trucoButtons.querySelector("#reTruco").classList.remove("hide");
          break;
        case Action.RE_TRUCO:
          trucoButtons.querySelector("#vale4").classList.remove("hide");
          break;
      }
      this.waiting = true;
    } else {
      const response = this.game.IAPlayer.truco({ response: true, lastSang });
      this.game.logMessage.show({
        player: Action.IA,
        action: response,
      });
      //console.log("IA RESP TRUCO ", response);
      this.currentResponse = Action.TRUCO;
      switch (response) {
        case Action.QUIERO:
          this.canTruco = this.game.IAPlayer;
          this.playerTruco = null;
          break;
        case Action.NO_QUIERO:
          this.playerDoesNotWant = this.playerTruco;
          break;
        default:
          this.truco.push(response);
          this.playerTruco = this.waitingPlayer(this.game.IAPlayer);
          break;
      }
    }
  }

  humanPlayCard() {
    //console.log("### HUMAN PLAY CARD ###");
    this.waiting = false;
    //this.humanCanPlayCard = false;
    this.swapTurn();
    this.continue();
  }

  IACanPlayCard() {
    this.game.IAPlayer.playCard();
    this.swapTurn();
  }

  humanGoToMazo() {
    this.debugLog();
  }

  debugLog() {
    let log = console.log;
    log(`NUMERO  DE MANOS: ${this.numberOfHands}`);
    log(`MANOS JUGADAS: ${this.playsOnHands}`);
    log("PLAYER TURN: ", this.playerTurn);
    log(`WAITING: ${this.waiting}`);
    log("");
    log("##### ENVIDO #####");
    log(`PUEDE ENVIDO: ${this.canEnvido}`);
    log(`CHANTS: ${this.chants}`);
    log(`PLAYER ENVIDO: ${this.playerEnvido}`);
    log(`WHO SANG: ${this.whoSang}`);
    log(`ENVIDO STATS: ${this.envidoStatsFlag}`);
    log(`PUNTOS GUARDADOS: ${this.savedPoints}`);
    log("");
    log(`##### TRUCO #####`);
    log("PLAYER TRUCO:", this.playerTruco);
    log(`CAN TRUCO: ${this.canTruco}`);
    log(`JUGADOR NO QUIERE: ${this.playerDoesNotWant}`);
    log(`TRUCO[] ${this.truco}`);
    log(`RESPUESTA ACTUAL: ${this.currentResponse}`);
    log(`HUMANO PUEDE JUGAR: ${this.humanCanPlayCard}`);
    log("");
    log(`##### PLAYERS ####`);
    log("HUMANO:", this.game.humanPlayer);
    log("IA: ", this.game.IAPlayer);
  }
}
