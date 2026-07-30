import { Card, Suit } from "../cards/Card";
import { Hand } from "../cards/Hand";

export class PlayValidator {

  static isLegalPlay(
    hand: Hand,
    card: Card,
    leadSuit?: Suit
  ): boolean {

    if (!leadSuit) {
      return true;
    }

    if (
      card.suit === leadSuit
    ) {
      return true;
    }

    if (
      hand.hasSuit(
        leadSuit
      )
    ) {
      return false;
    }

    return true;
  }
}