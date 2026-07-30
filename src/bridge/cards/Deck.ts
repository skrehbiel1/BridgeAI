import { Card, Suit, Rank } from "./Card";

export class Deck {
  cards: Card[] = [];

  constructor() {
    for (const suit of Object.values(Suit)) {
      for (let rank = 2; rank <= 14; rank++) {
        this.cards.push(
          new Card(
            suit,
            rank as Rank
          )
        );
      }
    }
  }

  shuffle(): void {
    for (
      let i = this.cards.length - 1;
      i > 0;
      i--
    ) {
      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [this.cards[i], this.cards[j]] = [
        this.cards[j],
        this.cards[i],
      ];
    }
  }

  deal(): Card {
    const card = this.cards.pop();

    if (!card) {
      throw new Error(
        "Deck is empty"
      );
    }

    return card;
  }
}