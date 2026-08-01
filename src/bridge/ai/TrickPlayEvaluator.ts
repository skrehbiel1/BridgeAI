import { Card } from "../cards/Card";
import { Hand } from "../cards/Hand";
import { Seat } from "../core/Seat";
import { TrumpSuit } from "../play/Contract";
import { PlayValidator } from "../play/PlayValidator";
import { Trick } from "../play/Trick";
import { TrickWinner } from "../play/TrickWinner";

import { CardRanker } from "./CardRanker";
import { OpeningLeadEvaluator } from "./OpeningLeadEvaluator";

export class TrickPlayEvaluator {
    static legalCards(
        hand: Hand,
        trick: Trick
    ): Card[] {
        return hand.cards.filter(card =>
            PlayValidator.isLegalPlay(
                hand,
                card,
                trick.leadSuit
            )
        );
    }

    static chooseDefensiveCard(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): Card {
        const legalCards =
            this.requireLegalCards(
                seat,
                hand,
                trick
            );

        /*
         * Opening lead.
         */
        if (trick.cards.length === 0) {
            return OpeningLeadEvaluator
                .chooseLead(legalCards);
        }

        /*
         * Second hand low.
         *
         * This is intentionally simple. Later we
         * can add exceptions for honor combinations,
         * singletons, and covering an honor.
         */
        if (trick.cards.length === 1) {
            return CardRanker.lowest(
                legalCards
            );
        }

        /*
         * Third or fourth hand:
         * win as cheaply as possible.
         */
        return this.lowestWinningCard(
            seat,
            legalCards,
            trick,
            trump
        ) ?? CardRanker.lowest(legalCards);
    }

    static chooseDeclarerCard(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): Card {
        const legalCards =
            this.requireLegalCards(
                seat,
                hand,
                trick
            );

        /*
         * For now, use the opening-lead evaluator
         * whenever declarer or dummy leads.
         */
        if (trick.cards.length === 0) {
            return OpeningLeadEvaluator
                .chooseLead(legalCards);
        }

        /*
         * Win with the lowest card that currently
         * takes the trick. Otherwise play low.
         */
        return this.lowestWinningCard(
            seat,
            legalCards,
            trick,
            trump
        ) ?? CardRanker.lowest(legalCards);
    }

    private static requireLegalCards(
        seat: Seat,
        hand: Hand,
        trick: Trick
    ): Card[] {
        const legalCards =
            this.legalCards(
                hand,
                trick
            );

        if (legalCards.length === 0) {
            throw new Error(
                `No legal cards available for ${seat}`
            );
        }

        return legalCards;
    }

    private static lowestWinningCard(
        seat: Seat,
        legalCards: Card[],
        trick: Trick,
        trump: TrumpSuit
    ): Card | undefined {
        const winningCards =
            legalCards.filter(card =>
                this.wouldCurrentlyWin(
                    seat,
                    card,
                    trick,
                    trump
                )
            );

        if (winningCards.length === 0) {
            return undefined;
        }

        return CardRanker.lowest(
            winningCards
        );
    }

    private static wouldCurrentlyWin(
        seat: Seat,
        card: Card,
        trick: Trick,
        trump: TrumpSuit
    ): boolean {
        const simulatedCards = [
            ...trick.cards,
            {
                seat,
                card
            }
        ];

        return (
            TrickWinner.determine(
                simulatedCards,
                trump
            ) === seat
        );
    }
}