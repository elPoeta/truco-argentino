import { getRandomInt } from "../utils/gameHelper.js";
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
  constructor({ game, name, itIsHand, hisTurn }) {
    super({ game, name, itIsHand, hisTurn });
    this.cardsInHand = this.setCardsInHand();
    this.strategyGame = null;
    this.probability = new Probability({ game });
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
        if (whoSang[i] === "H")
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
            .sort((a, b) => b.value - a.value)
        : null;

    const inHand = this.cardsInHand;
    const IABoard =
      this.playedCards.length === handNumber + 1
        ? this.playedCards[handNumber]
        : null;
    const humanBoard =
      this.game.humanPlayer.playedCards.length === handNumber + 1
        ? this.game.humanPlayer.playedCards[handNumber]
        : null;
    const { high, media, low } = this.classifyCards(this.cardsInHand);

    const mediumHigh = high + media;

    const humanScore = this.game.humanPlayer.score;
    const iaScore = this.score;
    const diff = iaScore - humanScore;
    const missing =
      this.game.scoreLimit - (humanScore > iaScore ? humanScore : iaScore);
    const pointInStake = this.pointInStake(lastSang);
    if (response) {
      return this.responseTruco({ handNumber });
    } else if (lastSang === null || lastSang === undefined || lastSang === "") {
      return this.sayTruco({ handNumber });
    } else {
      return this.iaChoice({ handNumber });
    }
    //RETURN QIUERO - NO QUIERO -T - RT - V4
  }

  responseTruco({ handNumber }) {
    switch (handNumber) {
      case 0:
        return "";
      case 1:
        return "";
      case 2:
        return "";
    }
  }

  sayTruco({ handNumber }) {
    switch (handNumber) {
      case 0:
        return "";
      case 1:
        return "";
      case 2:
        return "";
    }
  }

  iaChoice({ handNumber }) {
    switch (handNumber) {
      case 0:
        return "";
      case 1:
        return "";
      case 2:
        return "";
    }
  }

  classifyCards(cards) {
    const classification = {
      media: 0,
      high: 0,
      low: 0,
    };
    cards.forEach((card) => {
      if (card.value <= 6) {
        classification.low++;
      } else if (card.value <= 10) {
        classification.media++;
      } else {
        classification.high++;
      }
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
}
