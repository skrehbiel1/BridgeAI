import { Suit } from "../cards/Card";
import { PlayedCard } from "./PlayedCard";

export class Trick {
  cards: PlayedCard[] = [];

  leadSuit?: Suit;

  addCard(
    played: PlayedCard
  ): void {
    if (
      this.cards.length === 0
    ) {
      this.leadSuit =
        played.card.suit;
    }

    this.cards.push(
      played
    );
  }

  isComplete(): boolean {
    return (
      this.cards.length === 4
    );
  }

  clear(): void {
    this.cards = [];
    this.leadSuit = undefined;
  }
}