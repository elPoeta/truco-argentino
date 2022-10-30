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
    const t = pcc.sort(function (a, b) { return a - b });
    if (t.length % 2 == 0) return (t[t.length / 2] + t[t.length / 2 - 1]) / 2;
    else return t[(t.length - 1) / 2];
  }

  averageTruco(cards) {
    const sum = 0;
    for (let i = 0; i < cards.length; i++)
      sum = sum + cards[i].winnerProbability();
    return (sum / cards.length);
  }

  // TODO IMPLEMENT
  deductCard({ points, plays }) {
    let posibles = [];
    if (points <= 7) {
      this.posiblesCardsLow8({ points, plays, posibles });
    } else {
      if (plays.length === 2 && plays[0].suit === plays[1].suit) {
        // TODO SET POSIBLES
      }
      else return null;
    }




    for (let j = 0; j < plays.length; j++)
      for (let i = posibles.length - 1; i >= 0; i--) {
        if (posibles[i] != undefined && plays[j].number === posibles[i].number && plays[j].suit === posibles[i].suit) {
          posibles.splice(i);
          break;
        }
      }
    return posibles;
  }

  posiblesCardsLow8({ points, plays, posibles }) {
    posibles = this.cards.filter(card => card.envidoPoints === points);
    for (let j = 0; j < plays.length; j++)
      for (let i = posibles.length - 1; i >= 0; i--) {
        if (posibles[i] !== undefined && plays[j].palo === posibles[i].suit) {
          posibles[i] = undefined;
        }
      }
  }
}