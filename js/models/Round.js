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
import { Envido } from "./Envido.js";
export class Round {
  constructor({ game }) {
    this.game = game;
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
    this.deck = new Deck({ game });
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

    const cards = this.dealCards();

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
        if (handPlayer instanceof Human) handPlayer.cardsInHand.push(card);
        count++;
      } else {
        player.cards.push(card);
        if (player instanceof Human) player.cardsInHand.push(card);
      }
      roundDeck.splice(index, 1);
    }

    return roundDeck.length;
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

  continue(playerWinner) {
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
      console.log("WINNER ", playerWinner);
    }
  }

  winningHand(numberOfHands) { }

  winningRound() { }

  chooseCard() {
    console.log("CHOOSE ", this.playerTurn);
    if (this.playerTurn instanceof Human) {
      console.log("Humano choose card");
      this.waiting = true;
      this.humanCanSayEnvido();
    } else {
      console.log("IA play");

      this.swapTurn();
    }
  }

  humanCanSayEnvido() {
    if (this.canEnvido) {
      const envidoButtons = document.querySelector("#envido-buttons");
      if (envidoButtons.classList.contains("hide"))
        envidoButtons.classList.remove("hide");
    }
  }

  envidoResponse() {
    console.log("ENVIDO");
    if (this.playerEnvido instanceof Human) {
      this.waiting = true;
    } else {
      const card = this.game.humanPlayer.cardsInHand.getLast();
      // GET ACTION
      console.log("IA RESPONSE", card);
      // Si ia quiere Y || N
      // LOG CANTO
      // PLAY ENVIDO
      //this.playEnvido(true)

      // SINO cantar envido

      //this.chants.push("EE");
      //this.whoSang.push("IA");
      // LOG
      // this.playerEnvido = this.waitingPlayer(this.playerTurn);
      this.waiting = true;
    }
  }

  calculateEnvidoPoints() {
    let winner = 0;
    let loser = 0;
    for (const c in this.chants) {
      switch (this.chants[c]) {
        case Envido.ENVIDO:
          winner += 2;
          loser += 1;
          break;
        case Envido.ENVIDO_ENVIDO:
          winner += 2;
          loser += 1;
          break;
        case Envido.REAL_ENVIDO:
          winner += 3;
          loser += 1;
          break;
        case Envido.FALTA_ENVIDO:
          winner = this.game.scoreLimit - (this.game.humanPlayer.points < this.game.IAPlayer.points ? this.game.IAPlayer.points : this.game.humanPlayer.points);          // GANA EL PARTIDO POR EL MOMENTO
          loser += 1;
          break;
      }
    }
    return { winner, loser }
  }


  playEnvido(action) {
    this.canEnvido = false;
    this.playerEnvido = null;
  }

  trucoResponse() {
    console.log("TRUCO");
  }
}
