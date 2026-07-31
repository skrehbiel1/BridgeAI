import { Card, Suit } from "./Card";

export class Hand {
  cards: Card[] = [];

  add(card: Card): void {
    this.cards.push(card);
  }

  remove(card: Card): void {
    const index = this.cards.findIndex(
      current =>
        current.suit === card.suit &&
        current.rank === card.rank
    );

    if (index >= 0) {
      this.cards.splice(index, 1);
    }
  }

  cardsOfSuit(suit: Suit): Card[] {
    return this.cards.filter(
      card => card.suit === suit
    );
  }

  hasSuit(suit: Suit): boolean {
    return this.cards.some(
      card => card.suit === suit
    );
  }

  count(): number {
    return this.cards.length;
  }

  sort(): void {
    const suitOrder: Record<Suit, number> = {
      [Suit.Spades]: 4,
      [Suit.Hearts]: 3,
      [Suit.Diamonds]: 2,
      [Suit.Clubs]: 1,
    };

    this.cards.sort((a, b) => {
      if (a.suit !== b.suit) {
        return suitOrder[b.suit] - suitOrder[a.suit];
      }

      return b.rank - a.rank;
    });
  }
}