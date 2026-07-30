export enum Suit {
  Clubs = "C",
  Diamonds = "D",
  Hearts = "H",
  Spades = "S",
}

export enum Rank {
  Two = 2,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack = 11,
  Queen,
  King,
  Ace,
}

export class Card {
  constructor(
    public suit: Suit,
    public rank: Rank
  ) {}

  toString(): string {
    const rankMap: Record<number, string> = {
      11: "J",
      12: "Q",
      13: "K",
      14: "A",
    };

    return `${rankMap[this.rank] ?? this.rank}${this.suit}`;
  }
}