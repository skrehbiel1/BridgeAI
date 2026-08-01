import {
    Card,
    Rank,
    Suit
} from "../cards/Card";

import { CardRanker } from "./CardRanker";

export class OpeningLeadEvaluator {
    static chooseLead(
        legalCards: Card[]
    ): Card {
        if (legalCards.length === 0) {
            throw new Error(
                "Cannot choose an opening lead from an empty hand"
            );
        }

        const suits: Suit[] = [
            Suit.Spades,
            Suit.Hearts,
            Suit.Diamonds,
            Suit.Clubs
        ];

        const suitGroups =
            suits
                .map(suit => ({
                    suit,
                    cards: legalCards
                        .filter(
                            card =>
                                card.suit === suit
                        )
                        .sort(
                            (a, b) =>
                                b.rank - a.rank
                        )
                }))
                .filter(
                    group =>
                        group.cards.length > 0
                );

        suitGroups.sort(
            (a, b) =>
                b.cards.length -
                a.cards.length
        );

        const selectedSuit =
            suitGroups[0].cards;

        const sequenceLead =
            this.topOfSequence(
                selectedSuit
            );

        if (sequenceLead) {
            return sequenceLead;
        }

        /*
         * Fourth-best from the top of a suit
         * containing at least four cards.
         */
        if (selectedSuit.length >= 4) {
            return selectedSuit[3];
        }

        return CardRanker.lowest(
            selectedSuit
        );
    }

    private static topOfSequence(
        cards: Card[]
    ): Card | undefined {
        if (cards.length < 3) {
            return undefined;
        }

        for (
            let index = 0;
            index <= cards.length - 3;
            index++
        ) {
            const first =
                cards[index];

            const second =
                cards[index + 1];

            const third =
                cards[index + 2];

            const consecutive =
                first.rank ===
                    second.rank + 1 &&
                second.rank ===
                    third.rank + 1;

            const honorSequence =
                first.rank >= Rank.Ten;

            if (
                consecutive &&
                honorSequence
            ) {
                return first;
            }
        }

        return undefined;
    }
}