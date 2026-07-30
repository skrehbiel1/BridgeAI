import { Card, Suit } from "./Card";

export class Hand {
  cards: Card[] = [];

  add(card: Card): void {
    this.cards.push(card);
  }

  remove(card: Card): void {
    const index =
      this.cards.findIndex(
        c =>
          c.rank === card.rank &&
          c.suit === card.suit
      );

    if (index >= 0) {
      this.cards.splice(index, 1);
    }
  }

  hasSuit(
    suit: Suit
  ): boolean {
    return this.cards.some(
      c => c.suit === suit
    );
  }

  cardsOfSuit(
    suit: Suit
  ): Card[] {
    return this.cards.filter(
      c => c.suit === suit
    );
  }

  count(): number {
    return this.cards.length;
  }
}