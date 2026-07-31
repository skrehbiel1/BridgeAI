import { Suit } from "./Card";

export function suitSymbol(
    suit: Suit
): string {

    switch (suit) {

        case Suit.Spades:
            return "♠";

        case Suit.Hearts:
            return "♥";

        case Suit.Diamonds:
            return "♦";

        case Suit.Clubs:
            return "♣";
    }
}