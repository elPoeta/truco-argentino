import { Deck } from "./Deck.js";

export class Probability {
  constructor({ game }) {
    this.game = game;
    this.media1 = 0.15;
    this.media2 = 0.25;
    this.viewedCard1 = -20;
    this.viewedCard2 = 20;
    this.deck = new Deck({ game });
    this.cards = this.deck.generate();
  }

  weightPoints({ points }) {
    const envidoPoints1 = this.media11 / 7;
    const envidoPoints2 = (1 - this.media2) / (33 - 20);
    const h = 1 - 33 * envidoPoints2;

    if (points <= 7) return points * envidoPoints1;
    else return points * envidoPoints2 + h;
  }

  viewedCard({ card }) {
    if (!card) return 0;
    else {
      const envido = card.envidoPoints;
      var media = (this.viewedCard2 - this.viewedCard1) / 7;
      var h = this.viewedCard1;
      return envido * media + h;
    }
  }

  averagePoints({ pcc }) {
    if (!pcc.length) return null;
    const t = pcc.sort(function (a, b) {
      return a - b;
    });
    if (t.length % 2 == 0) return (t[t.length / 2] + t[t.length / 2 - 1]) / 2;
    else return t[(t.length - 1) / 2];
  }

  averageTruco(cards) {
    const sum = 0;
    for (let i = 0; i < cards.length; i++)
      sum = sum + cards[i].winnerProbability();
    return sum / cards.length;
  }

  deductCard({ points, playedCards }) {
    let posibleCards = [];
    if (points <= 7) {
      this.posiblesCardsLow8({ points, playedCards, posibleCards });
    } else {
      if (
        playedCards.length === 2 &&
        playedCards[0].suit === playedCards[1].suit
      ) {
        const envidoPoints1 = playedCards[0].envidoPoints;
        const envidoPoints2 = playedCards[1].envidoPoints;
        const suit = playedCards[0].suit;
        if (envidoPoints1 + envidoPoints2 + 20 !== points) {
          const p =
            envidoPoints1 > envidoPoints2
              ? points - envidoPoints1 - 20
              : points - envidoPoints2 - 20;
          posibleCards = this.getPosibleCardsBySuitAndCardNumber(suit, p);
        } else return []; //null;
      }
      for (let i = 0; i < playedCards.length; i++) {
        const suit = playedCards[i].suit;
        const cardNumber = points - playedCards[i].envidoPoints - 20;
        if (0 <= cardNumber && cardNumber <= 7)
          posibleCards.push(
            ...this.getPosibleCardsBySuitAndCardNumber(suit, cardNumber)
          );
      }
    }

    for (let j = 0; j < playedCards.length; j++)
      for (let i = posibleCards.length - 1; i >= 0; i--) {
        if (
          posibleCards[i] != undefined &&
          playedCards[j].number === posibleCards[i].number &&
          playedCards[j].suit === posibleCards[i].suit
        ) {
          posibleCards.splice(i);
          break;
        }
      }
    return posibleCards;
  }

  posiblesCardsLow8({ points, playedCards, posibleCards }) {
    posibleCards = this.cards.filter((card) => card.envidoPoints === points);
    for (let j = 0; j < playedCards.length; j++)
      for (let i = posibleCards.length - 1; i >= 0; i--) {
        if (
          posibleCards[i] !== undefined &&
          playedCards[j].suit === posibleCards[i].suit
        ) {
          posibleCards[i] = undefined;
        }
      }
  }

  getPosibleCardsBySuitAndCardNumber(suit, cardNumber) {
    switch (cardNumber) {
      case 0:
        return this.cards.filter(
          (card) =>
            (card.number === 12 || card.number === 11 || card.number == 10) &&
            card.suit === suit
        );
      default:
        return this.cards.filter(
          (card) => card.number === cardNumber && card.suit === suit
        );
    }
  }
}
