import { getRandomInt, playedCardCoords } from "../utils/gameHelper.js";
import {
  POS_CARD_1,
  POS_CARD_2,
  POS_CARD_3,
  TOP_CARD_Y,
} from "../utils/helpers.js";
import { Action } from "./Action.js";
import { Card } from "./Card.js";
import { Player } from "./Player.js";
import { Probability } from "./Probability.js";

export class IA extends Player {
  constructor({ game }) {
    super({ game });
    this.name = "el poeta";
    this.cardsInHand = this.setCardsInHand();
    this.cardsInHandHidden = [];
    this.strategyGame = null;
    this.probability = new Probability({ game });
  }

  setInitialValues({ itIsHand, hisTurn }) {
    this.baseValues();
    this.cardsInHand = this.setCardsInHand();
    this.cardsInHandHidden = [];
    this.strategyGame = null;
    this.itIsHand = itIsHand;
    this.hisTurn = hisTurn;
  }

  setCardsInHand() {
    return [
      new Card({
        game: this.game,
        x: POS_CARD_1,
        y: TOP_CARD_Y,
        frameX: 1,
        frameY: 4,
      }),
      new Card({
        game: this.game,
        x: POS_CARD_2,
        y: TOP_CARD_Y,
        frameX: 1,
        frameY: 4,
      }),
      new Card({
        game: this.game,
        x: POS_CARD_3,
        y: TOP_CARD_Y,
        frameX: 1,
        frameY: 4,
      }),
    ];
  }

  removeAllCards() {
    this.cards = [];
    this.playedCards = [];
    this.cardsInHandHidden = [];
  }

  playCard() {
    if (!this.strategyGame) this.strategyGame = this.classicStrategy;
    let index = this.strategyGame();
    index = index < 0 ? 0 : index;
    const card = this.cardsInHandHidden[index];
    const len =
      this.playedCards.length + this.game.humanPlayer.playedCards.length;
    const { x, y } = playedCardCoords[len];
    card.x = x;
    card.y = y;
    card.renderOrder = len;
    this.playedCards.push(card);
    this.game.playedCards.push(card);
    this.cardsInHandHidden.splice(index, 1);
    this.cardsInHand.splice(index, 1);
  }

  strategy() {
    const { low, media } = this.classifyCards(this.cardsInHandHidden);
    if (low === 1 && media === 1) {
      return this.cardsInHandHidden[0].value < this.cardsInHandHidden[1].value
        ? 1
        : 0;
    }
    return this.classicStrategy();
  }

  classicStrategy() {
    let card = null;
    let numberOfHands = this.game.round.numberOfHands;
    let index = -1;
    const { high } = this.classifyCards(this.cardsInHandHidden);
    if (!(this.game.round.playsOnHands === 0)) {
      const len = this.game.humanPlayer.playedCards.length - 1;
      card = this.game.humanPlayer.playedCards[len];
      index = this.choice({ order: 1, card });
      if (index < 0) {
        index = this.choice({ order: 0 });
      } else {
        if (
          numberOfHands === 0 &&
          this.cardsInHandHidden[index].value >= 11 &&
          card.value <= 7
        )
          index = this.choice({ order: 0 });
      }
    } else {
      switch (numberOfHands) {
        case 0:
          if (high >= 2) {
            index = this.choice({
              order: 0,
            });
          } else if (high >= 1) {
            index = this.choice({ order: 1, card: null, classification: 1 });
            if (index < 0) index = this.choice(1, null, 0);
          } else index = this.choice({ order: 1 });
          break;
        case 1:
          if (this.hands > this.game.humanPlayer.hands) {
            index = this.choice({ order: 0 });
          } else {
            index = this.choice({ order: 1 });
          }
          break;
        case 2:
          index = 0;
          break;
      }
    }
    return index;
  }

  choice({ order, card, classification }) {
    let index = -1;
    if (card === undefined) card = null;
    let value = order === 0 ? 99 : card === null ? -1 : 99;
    for (const c in this.cardsInHandHidden) {
      let currentValue = this.cardsInHandHidden[c].value;
      const { calificationValue } = this.classify(this.cardsInHandHidden[c]);
      if (classification !== undefined && classification !== calificationValue)
        continue;
      switch (order) {
        case 0:
          if (currentValue < value) {
            value = currentValue;
            index = c;
          }
          break;
        case 1:
          if (card === null) {
            if (currentValue > value) {
              value = currentValue;
              index = c;
            }
          } else {
            if (currentValue < value && currentValue > card.value) {
              value = currentValue;
              index = c;
            }
          }
          break;
      }
    }

    return index;
  }

  flor({ lastSang }) {
    const points = this.getEnvidoPoints();
    console.log("FLOR-POINTS ", points);
    switch (lastSang) {
      case Action.FLOR:
        if (points >= 30) {
          return Action.CONTRA_FLOR_AL_RESTO;
        } else if (points >= 28) {
          return Action.CONTRA_FLOR;
        } else if (points >= 25) {
          return Action.CON_FLOR_QUIERO;
        } else {
          return Action.CON_FLOR_ME_ACHICO;
        }
      case Action.CONTRA_FLOR:
        if (points >= 30) {
          return Action.CONTRA_FLOR_AL_RESTO;
        } else if (points >= 28) {
          return Action.QUIERO;
        } else {
          return Action.NO_QUIERO;
        }
      default:
        return Action.QUIERO;
    }
  }

  envido({ lastSang, pointsAccumulate, lastCard }) {
    const points = this.getEnvidoPoints();
    const humanPoints = this.game.humanPlayer.score;
    const diff = humanPoints - this.score;
    const missing =
      this.game.scoreLimit -
      (humanPoints > this.score ? humanPoints : this.score);

    const posible = this.probability.viewedCard({ card: lastCard });
    const value = this.probability.weightPoints({ points });
    let random = getRandomInt(0, 100);
    const { loser } = this.game.round.calculateEnvidoPoints();
    const unwantedPoints = loser;

    if (this.score >= this.game.scoreLimit - 2) {
      if (lastSang !== null && lastSang !== undefined)
        switch (lastSang) {
          case Action.ENVIDO:
          case Action.ENVIDO_ENVIDO:
          case Action.REAL_ENVIDO:
            return Action.FALTA_ENVIDO;
        }
      else {
        let averagePoints = this.probability.averagePoints({
          pcc: this.envidoS,
        });
        averagePoints = averagePoints === null ? 0 : -(15 - averagePoints);
        if (random + diff < value * 100) return Action.FALTA_ENVIDO;
        else return "";
      }
    }

    if (pointsAccumulate === 0) {
      if (lastCard !== undefined) {
        if (points > 28) {
          const averagePoints = this.probability.averagePoints({
            pcc: this.envidoS.concat(this.envidoEnvido, this.realEnvido),
          });
          if (averagePoints === null || averagePoints > points)
            return points > 30 ? Action.REAL_ENVIDO : Action.ENVIDO;
          else return "R";
        } else {
          if (lastCard.envidoPoints > points) return "";
          if (random + posible + diff < value * 100) return Action.ENVIDO;
          else return "";
        }
      } else if (random + posible < value * 100) return Action.ENVIDO;
      else return "";
    } else {
      if (points <= 7) return Action.NO_QUIERO;
      if (
        this.score > humanPoints &&
        pointsAccumulate > missing &&
        unwantedPoints > missing &&
        lastSang !== Action.FALTA_ENVIDO
      )
        return Action.FALTA_ENVIDO;
      if (
        pointsAccumulate > missing &&
        this.score > humanPoints &&
        lastSang !== Action.FALTA_ENVIDO
      ) {
        let averagePoints = this.probability.averagePoints({
          pcc: this.realEnvido.concat(this.envidoS, this.envidoEnvido),
        });
        averagePoints = averagePoints === null ? 0 : -(15 - averagePoints);

        console.log(
          `${random} ${posible} ${diff} ${pointsAccumulate} ${averagePoints}< ${value} * 100`
        );

        if (
          random + posible + diff + pointsAccumulate + averagePoints <
          value * 100
        )
          return Action.FALTA_ENVIDO;
      }

      if (unwantedPoints + humanPoints > 30) return Action.QUIERO;
      let averagePoints = 0;
      switch (lastSang) {
        case Action.ENVIDO:
          averagePoints = this.probability.averagePoints({ pcc: this.envidoS });
          averagePoints = averagePoints === null ? 0 : -(15 - averagePoints);
          if (
            random + posible + diff + pointsAccumulate + averagePoints <
            value * 100
          ) {
            if (points >= 30) return Action.ENVIDO_ENVIDO;
            else return Action.QUIERO;
          } else {
            if (points >= 30) return Action.QUIERO;
            else return Action.NO_QUIERO;
          }

        case Action.ENVIDO_ENVIDO:
          if (points >= 30) random = 0;
          averagePoints = this.probability.averagePoints({
            pcc: this.envidoEnvido.concat(this.envidoS),
          });
          averagePoints = averagePoints === null ? 0 : -(15 - averagePoints);
          if (
            random + posible + diff + pointsAccumulate + averagePoints <
            value * 100
          )
            return Action.QUIERO;
          else return Action.NO_QUIERO;

        case Action.REAL_ENVIDO:
          if (points >= 31) random = 0;
          averagePoints = this.probability.averagePoints({
            pcc: this.realEnvido.concat(this.envidoS, this.envidoEnvido),
          });
          averagePoints = averagePoints === null ? 0 : -(15 - averagePoints);
          if (
            random + posible + diff + pointsAccumulate * 2 + averagePoints * 2 <
            value * 100
          )
            return Action.QUIERO;
          else return Action.NO_QUIERO;

        case Action.FALTA_ENVIDO:
          if (random + posible + diff + pointsAccumulate * 2 < value * 100)
            return Action.QUIERO;
          else return Action.NO_QUIERO;
      }
      return "";
    }
  }

  statsEnvido(chants, whoSang, points) {
    if (chants !== undefined && chants !== null)
      for (var i in chants) {
        if (whoSang[i] === Action.HUMAN)
          switch (chants[i]) {
            case Action.ENVIDO:
              this.envidoS.push(points);
              break;
            case Action.ENVIDO_ENVIDO:
              this.envidoEnvido.push(points);
              break;
            case Action.REAL_ENVIDO:
              this.realEnvido.push(points);
              break;
            case Action.FALTA_ENVIDO:
              this.faltaEnvido.push(points);
              break;
          }
      }
    return;
  }

  truco({ response, lastSang }) {
    const handNumber = this.game.round.numberOfHands;
    const possibleCards =
      this.game.round.savedPoints !== null
        ? this.probability
            .deductCard({
              points: this.game.round.savedPoints,
              playedCards: this.game.humanPlayer.playedCards,
            })
            .sort((a, b) => b.value - a.value) // Can return null
        : null;

    const IABoard =
      this.playedCards.length === handNumber + 1
        ? this.playedCards[handNumber]
        : null;
    const humanBoard =
      this.game.humanPlayer.playedCards.length === handNumber + 1
        ? this.game.humanPlayer.playedCards[handNumber]
        : null;
    const { high, media, low } = this.classifyCards(this.cardsInHandHidden);

    const mediumHigh = high + media;

    const humanScore = this.game.humanPlayer.score;
    const iaScore = this.score;
    const diff = iaScore - humanScore;

    if (response) {
      return this.responseTruco({
        lastSang,
        high,
        media,
        low,
        mediumHigh,
        diff,
        IABoard,
        humanBoard,
        possibleCards,
      });
    } else if (lastSang === null || lastSang === undefined || lastSang === "") {
      return this.sayTruco({
        high,
        mediumHigh,
        low,
        possibleCards,
        humanBoard,
      });
    } else {
      return this.iaChoice({ lastSang, humanBoard, high, mediumHigh });
    }
  }

  responseTruco({
    lastSang,
    high,
    media,
    low,
    mediumHigh,
    diff,
    IABoard,
    humanBoard,
    possibleCards,
  }) {
    switch (this.game.round.numberOfHands) {
      case 0:
        return this.responseTrucoHand_0({
          lastSang,
          high,
          low,
          mediumHigh,
          diff,
        });
      case 1:
        return this.responseTrucoHand_1({
          lastSang,
          IABoard,
          mediumHigh,
          high,
          media,
          low,
          humanBoard,
          possibleCards,
        });
      case 2:
        return this.responseTrucoHand_2({
          lastSang,
          IABoard,
          possibleCards,
          humanBoard,
          mediumHigh,
          high,
        });
    }
  }

  responseTrucoHand_0({ lastSang, high, low, mediumHigh, diff }) {
    const random = getRandomInt(0, 100);
    switch (lastSang) {
      case Action.TRUCO:
        if (this.envidoWinnerPoints < 2 && mediumHigh >= 2 && high >= 1)
          return Action.QUIERO;
        if (low === 3 && random <= 50) return Action.RE_TRUCO;
        if (mediumHigh >= 2 && diff < 0) return Action.RE_TRUCO;
        if (mediumHigh >= 1 && diff > 0) return Action.QUIERO;
        return random < 66 ? Action.NO_QUIERO : Action.QUIERO;

      case Action.RE_TRUCO:
      case Action.VALE_4:
        if (high >= 2) return Action.QUIERO;
        if (mediumHigh >= 2 && diff > 3) return Action.QUIERO;
        if (this.envidoWinnerPoints >= 2) return Action.NO_QUIERO;
        return Action.NO_QUIERO;
    }
  }

  responseTrucoHand_1({
    lastSang,
    IABoard,
    mediumHigh,
    high,
    media,
    low,
    humanBoard,
    possibleCards,
  }) {
    if (this.win(0) > 0) {
      if (IABoard === null) {
        switch (lastSang) {
          case Action.RE_TRUCO:
            if (mediumHigh >= 1)
              return high >= 1 ? Action.VALE_4 : Action.QUIERO;
            else if (low === 1 && media === 1) return Action.QUIERO;
            else return Action.NO_QUIERO;
          case Action.VALE_4:
            if (mediumHigh >= 1) return Action.QUIERO;
            return Action.NO_QUIERO;
        }
      } else {
        switch (lastSang) {
          case Action.TRUCO:
            if (this.cardsInHandHidden[0].value >= 11) return Action.RE_TRUCO;
            if (IABoard.value >= 11) return Action.RE_TRUCO;
            if (IABoard.value >= 7) {
              if (this.cardsInHandHidden[0].value >= 10) return Action.RE_TRUCO;
              else return Action.QUIERO;
            } else {
              let random = getRandomInt(0, 100);
              if (this.cardsInHandHidden[0].value >= 6) {
                if (this.envidoWinnerPoints >= 3 && random <= 66)
                  return Action.NO_QUIERO;
                else return Action.QUIERO;
              }
            }
            return Action.NO_QUIERO;
          case Action.RE_TRUCO:
            if (this.cardsInHandHidden[0].value >= 11) return Action.VALE_4;
            if (IABoard.value >= 11) return Action.VALE_4;
            if (IABoard.value >= 9) return Action.QUIERO;
            if (IABoard.value >= 6)
              if (this.cardsInHandHidden[0].value >= 9) return Action.QUIERO;
            if (this.cardsInHandHidden[0].value >= 9) return Action.QUIERO;
            else return Action.NO_QUIERO;
          case Action.VALE_4:
            if (this.cardsInHandHidden[0].value >= 11) return Action.QUIERO;
            if (IABoard.value >= 11) return Action.QUIERO;
            if (IABoard.value >= 9) return Action.QUIERO;
            if (IABoard.value >= 6)
              if (this.cardsInHandHidden[0].value >= 9) return Action.QUIERO;
            if (this.cardsInHandHidden[0].value >= 9) return Action.QUIERO;
            else return Action.NO_QUIERO;
        }
      }
    } else if (this.win(0) === 0) {
      if (humanBoard === null && possibleCards !== null)
        humanBoard = possibleCards[0];
      if (IABoard !== null && IABoard.value < 8) return Action.NO_QUIERO;
      if (humanBoard !== null && this.iKill(humanBoard) === -1)
        return Action.NO_QUIERO;
      switch (lastSang) {
        case Action.TRUCO:
          if (humanBoard !== null && this.iKill(humanBoard) > -1)
            return Action.RE_TRUCO;
          if (mediumHigh > 0) return Action.QUIERO;
          return Action.NO_QUIERO;
        case Action.RE_TRUCO:
          if (humanBoard !== null && this.iKill(humanBoard) > -1)
            return Action.VALE_4;
          if (IABoard !== null && IABoard.value >= 11) return Action.QUIERO;
          if (IABoard !== null && IABoard.value >= 13) return Action.VALE_4;
          if (high > 0) return Action.QUIERO;
          return Action.NO_QUIERO;
        case Action.VALE_4:
          if (IABoard !== null && IABoard.value >= 11) return Action.QUIERO;
          if (high > 0) return Action.QUIERO;
          return Action.NO_QUIERO;
      }
    } else {
      if (humanBoard === null) {
        switch (lastSang) {
          case Action.TRUCO:
            if (mediumHigh === 2) return Action.QUIERO;
            return Action.NO_QUIERO;
          case Action.RE_TRUCO:
            if (high === 2) return Action.QUIERO;
            return Action.NO_QUIERO;
          case Action.VALE_4:
            if (high === 2) return Action.QUIERO;
            return Action.NO_QUIERO;
        }
      } else {
        const kill = this.iKill(humanBoard);
        switch (lastSang) {
          case Action.RE_TRUCO:
          case Action.VALE_4:
            if (kill === -1) return Action.NO_QUIERO;
            if (high === 2)
              return lastSang === Action.VALE_4 ? Action.QUIERO : Action.VALE_4;
            if (
              this.classify(this.cardsInHandHidden[1 - kill])
                .calificationValue >= 1
            )
              return Action.QUIERO;
            return Action.NO_QUIERO;
        }
      }
    }
    return Action.NO_QUIERO;
  }

  responseTrucoHand_2({
    lastSang,
    IABoard,
    possibleCards,
    humanBoard,
    mediumHigh,
    high,
  }) {
    if (this.win(1) > 0) {
      if (IABoard === null) {
        switch (lastSang) {
          case Action.RE_TRUCO:
            if (this.cardsInHandHidden[0].value >= 13) return Action.VALE_4;
            if (this.cardsInHandHidden[0].value >= 11) return Action.QUIERO;
            return Action.NO_QUIERO;
          case Action.VALE_4:
            if (this.cardsInHandHidden[0].value >= 13) return Action.QUIERO;
            return Action.NO_QUIERO;
        }
      } else {
        let random;
        switch (lastSang) {
          case Action.TRUCO:
            random = getRandomInt(0, 100);
            if (possibleCards !== undefined && possibleCards !== null) {
              if (
                possibleCards.length > 0 &&
                possibleCards[0].value < IABoard.value
              )
                return Action.QUIERO;
              else return Action.NO_QUIERO;
            }
            if (IABoard.value >= 12) return Action.RE_TRUCO;
            if (IABoard.value >= 9) return Action.QUIERO;
            if (IABoard.value >= 6) {
              if (this.envidoWinnerPoints >= 3) return Action.NO_QUIERO;
              else if (random <= 33) return Action.QUIERO;
            }
            return Action.NO_QUIERO;
          case Action.RE_TRUCO:
            random = getRandomInt(0, 100);
            if (IABoard.value >= 13) return Action.VALE_4;
            if (IABoard.value >= 9) return Action.QUIERO;
            if (IABoard.value >= 6) {
              if (this.envidoWinnerPoints >= 3) return Action.NO_QUIERO;
              else if (random <= 33) return Action.QUIERO;
            }
            return Action.NO_QUIERO;
          case Action.VALE_4:
            if (IABoard.value >= 13) return Action.QUIERO;
            else return Action.NO_QUIERO;
        }
      }
    } else if (this.win(1) === 0) {
      if (humanBoard === null && possibleCards !== null)
        humanBoard = possibleCards[0];

      if (IABoard !== null && IABoard.value < 8) return Action.NO_QUIERO;
      if (humanBoard !== null && this.iKill(humanBoard) === -1)
        return Action.NO_QUIERO;
      switch (lastSang) {
        case Action.TRUCO:
          if (humanBoard !== null && this.iKill(humanBoard) > -1)
            return Action.RE_TRUCO;
          if (mediumHigh > 0) return Action.QUIERO;
          return Action.NO_QUIERO;
        case Action.RE_TRUCO:
          if (humanBoard !== null && this.iKill(humanBoard) > -1)
            return Action.VALE_4;
          if (high > 0) return Action.QUIERO;
          return Action.NO_QUIERO;
        case Action.VALE_4:
          if (high > 0) return Action.QUIERO;
          return Action.NO_QUIERO;
      }
    } else {
      if (humanBoard === null) {
        switch (lastSang) {
          case Action.TRUCO:
            if (possibleCards !== null && possibleCards !== undefined)
              if (
                possibleCards.length > 0 &&
                possibleCards[0].value <= this.cardsInHandHidden[0].value
              )
                return Action.RE_TRUCO;
            if (this.cardsInHandHidden[0].value >= 11) return Action.RE_TRUCO;
            if (this.cardsInHandHidden[0].value >= 9) return Action.QUIERO;
            if (this.cardsInHandHidden[0].value >= 7) {
              if (this.envidoWinnerPoints >= 3) return Action.NO_QUIERO;
              else {
                if (
                  this.playedCards[0].value -
                    this.game.humanPlayer.playedCards[0].value >
                    3 &&
                  this.game.humanPlayer.playedCards[0].value > 7
                )
                  return Action.NO_QUIERO;
                else return Action.QUIERO;
              }
            }
            return Action.NO_QUIERO;
          case Action.RE_TRUCO:
            let random = getRandomInt(0, 100);
            if (this.cardsInHandHidden[0].value >= 13) return Action.VALE_4;
            if (this.cardsInHandHidden[0].value >= 11) return Action.QUIERO;
            if (this.cardsInHandHidden[0].value >= 8) return Action.QUIERO;
            if (this.cardsInHandHidden[0].value >= 7) {
              if (this.envidoWinnerPoints >= 3) return Action.NO_QUIERO;
              else {
                if (
                  this.playedCards[0].value -
                    this.game.humanPlayer.playedCards[0].value >
                    3 &&
                  this.game.humanPlayer.playedCards[0].value > 7
                )
                  if (random <= 66) return Action.NO_QUIERO;
                  else return Action.QUIERO;
              }
            }

            return Action.NO_QUIERO;
          case Action.VALE_4:
            if (this.cardsInHandHidden[0].value >= 11) return Action.QUIERO;

            return Action.NO_QUIERO;
        }
      } else {
        switch (lastSang) {
          case Action.RE_TRUCO:
            if (this.cardsInHandHidden[0].value > humanBoard.value)
              return Action.VALE_4;
            return Action.NO_QUIERO;
          case Action.VALE_4:
            if (this.cardsInHandHidden[0].value > humanBoard.value)
              return Action.QUIERO;
            return Action.NO_QUIERO;
        }
      }
    }
  }

  sayTruco({ high, mediumHigh, low, possibleCards, humanBoard }) {
    switch (this.game.round.numberOfHands) {
      case 0:
        return this.sayTrucoHand_0({ mediumHigh });
      case 1:
        return this.sayTrucoHand_1({
          high,
          mediumHigh,
          low,
          possibleCards,
          humanBoard,
        });
      case 2:
        return this.sayTrucoHand_2({ humanBoard, possibleCards, mediumHigh });
    }
  }

  sayTrucoHand_0({ mediumHigh }) {
    if (mediumHigh >= 3) return Action.TRUCO;
    return "";
  }

  sayTrucoHand_1({ high, mediumHigh, low, possibleCards, humanBoard }) {
    if (this.win(0) > 0) {
      this.strategyGame = this.strategy;

      if (high === 2) return Action.TRUCO;
      if (mediumHigh === 2) return Action.TRUCO;
      if (low === 1 && high === 1) return "";
      if (high >= 1) return Action.TRUCO;
      return "";
    } else if (this.win(0) === 0) {
      if (humanBoard !== null && this.iKill(humanBoard) > -1)
        return Action.TRUCO;
      if (humanBoard !== null && humanBoard.value <= 7) return Action.TRUCO;
      if (mediumHigh > 0) return Action.TRUCO;
      return "";
    } else {
      if (this.iKill(humanBoard) !== -1) {
        if (high === 2) return Action.TRUCO;
        if (mediumHigh >= 1) return "";
        return "";
      } else {
        if (
          possibleCards !== null &&
          humanBoard.value <= 4 &&
          possibleCards.length > 0 &&
          possibleCards[0].value <= 6
        )
          return Action.TRUCO;
        return "";
      }
    }
  }

  sayTrucoHand_2({ humanBoard, possibleCards, mediumHigh }) {
    let random = getRandomInt(0, 100);
    if (this.win(1) < 0) {
      if (this.iKill(humanBoard) !== -1) return Action.TRUCO;
      if (
        possibleCards !== null &&
        possibleCards.length > 0 &&
        this.iKill(possibleCards[0]) !== -1
      )
        return Action.TRUCO;
      if (random <= 33 && humanBoard.value < 8) return Action.TRUCO;
      return "";
    } else if (this.win(1) === 0) {
      if (humanBoard !== null && this.iKill(humanBoard) > -1)
        return Action.TRUCO;
      if (humanBoard !== null && humanBoard.value <= 7) return Action.TRUCO;
      if (mediumHigh > 0) return Action.TRUCO;
      return "";
    } else {
      if (this.cardsInHandHidden[0].value >= 10) return Action.TRUCO;
      if (
        possibleCards !== null &&
        possibleCards.length > 0 &&
        this.iKill(possibleCards[0]) !== -1
      )
        return Action.TRUCO;
      else
        possibleCards !== null &&
          possibleCards.length > 0 &&
          this.iKill(possibleCards[0]) === -1;
      return "";
    }
  }

  iaChoice({ lastSang, humanBoard, high, mediumHigh }) {
    switch (this.game.round.numberOfHands) {
      case 0:
        return this.iaChoiceHand_0({ lastSang, humanBoard, high, mediumHigh });
      case 1:
        return this.iaChoiceHand_1({ lastSang, humanBoard, high, mediumHigh });
      case 2:
        return this.iaChoiceHand_2({ lastSang, humanBoard, high });
    }
  }

  iaChoiceHand_0({ lastSang, humanBoard, high, mediumHigh }) {
    if (humanBoard !== null) {
      let kill = this.iKill(humanBoard);
      switch (lastSang) {
        case Action.TRUCO:
          if (kill !== -1) {
            if (high === 2) return Action.RE_TRUCO;
            else return "";
          } else {
            return "";
          }
        case Action.RE_TRUCO:
          if (kill !== -1) {
            if (high === 2) return Action.VALE_4;
            else return "";
          } else {
            return "";
          }
        default:
          return "";
      }
    } else {
      switch (lastSang) {
        case Action.RE_TRUCO:
          if (high >= 2) return Action.VALE_4;
          if (mediumHigh >= 2) return "";
        default:
          return "";
      }
    }
  }

  iaChoiceHand_1({ lastSang, humanBoard, high, mediumHigh }) {
    if (this.win(0) > 0) {
      switch (lastSang) {
        case Action.TRUCO:
          if (high >= 1) return Action.RE_TRUCO;
          return "";
        case Action.RE_TRUCO:
          if (high >= 1) return Action.VALE_4;
          return "";
        default:
          return "";
      }
    } else if (this.win(0) === 0) {
      if (humanBoard !== null && this.iKill(humanBoard) > -1)
        return lastSang === Action.TRUCO ? Action.RE_TRUCO : Action.VALE_4;
      if (high > 0)
        return lastSang === Action.TRUCO ? Action.RE_TRUCO : Action.VALE_4;
      return "";
    } else {
      if (this.iKill(humanBoard) !== -1) {
        switch (lastSang) {
          case Action.TRUCO:
            if (mediumHigh >= 2 && high >= 1) return Action.RE_TRUCO;
            return "";
          case Action.RE_TRUCO:
            if (high >= 2) return Action.VALE_4;
            return "";
          default:
            return "";
        }
      } else {
        switch (lastSang) {
          case Action.TRUCO:
          case Action.RE_TRUCO:
          case Action.VALE_4:
            return "";
        }
      }
    }
    return "";
  }

  iaChoiceHand_2({ lastSang, humanBoard, high }) {
    if (this.win(1) > 0) {
      switch (lastSang) {
        case Action.TRUCO:
          if (high === 1) return Action.RE_TRUCO;
          return "";
        case Action.RE_TRUCO:
          if (this.cardsInHandHidden[0].value >= 13) return Action.VALE_4;
          return "";
        default:
          return "";
      }
    } else if (this.win(1) === 0) {
      if (humanBoard !== null && this.iKill(humanBoard) > -1)
        return lastSang === Action.TRUCO ? Action.RE_TRUCO : Action.VALE_4;
      if (high > 0)
        return lastSang === Action.TRUCO ? Action.RE_TRUCO : Action.VALE_4;
      return "";
    } else {
      switch (lastSang) {
        case Action.TRUCO:
          if (humanBoard.value < this.cardsInHandHidden[0].value)
            return Action.RE_TRUCO;
          if (humanBoard.value < 9) return Action.RE_TRUCO;
          return "";
        case Action.RE_TRUCO:
          if (humanBoard.value < this.cardsInHandHidden[0].value)
            return Action.VALE_4;
          return "";
        default:
          return "";
      }
    }
  }

  classify(card) {
    if (card.value <= 6) {
      return { calificationValue: 0, calificationType: "low" };
    } else if (card.value <= 10) {
      return { calificationValue: 1, calificationType: "media" };
    } else {
      return { calificationValue: 2, calificationType: "high" };
    }
  }

  classifyCards(cards) {
    const classification = {
      media: 0,
      high: 0,
      low: 0,
    };
    cards.forEach((card) => {
      const { calificationType } = this.classify(card);
      classification[calificationType]++;
    });
    return classification;
  }

  pointInStake(lastSang) {
    switch (lastSang) {
      case Action.TRUCO:
        return { currentPoints: 2, nextAction: Action.RE_TRUCO, nextPoints: 3 };
      case Action.RE_TRUCO:
        return { currentPoints: 3, nextAction: Action.VALE_4, nextPoints: 4 };
      case Action.VALE_4:
        return { currentPoints: 4, nextAction: "", nextPoints: 4 };
      default:
        return { currentPoints: 1, nextAction: Action.TRUCO, nextPoints: 2 };
    }
  }

  win(handNumber) {
    return (
      this.playedCards[handNumber].value -
      this.game.humanPlayer.playedCards[handNumber].value
    );
  }

  iKill(card) {
    let index = -1;
    let value = 99;
    for (let i = 0; i < this.cardsInHandHidden.length; i++)
      if (card.value < this.cardsInHandHidden[i].value)
        if (this.cardsInHandHidden[i].value < value) {
          value = this.cardsInHandHidden[i].value;
          index = i;
        }
    return index;
  }

  moreLow(card) {
    for (let i = 0; i < this.cardsInHandHidden.length; i++) {
      if (card.value > this.cardsInHandHidden[i].value) return true;
    }
    return false;
  }
}
