import { Card } from "../cards/Card";
import { Hand } from "../cards/Hand";
import { Trick } from "../play/Trick";
import { PlayValidator } from "../play/PlayValidator";
import { TrickWinner } from "../play/TrickWinner";
import { TrumpSuit } from "../play/Contract";
import { Seat } from "../core/Seat";
import { CardRanker } from "./CardRanker";
import {
    OpeningLeadEvaluator
} from "./OpeningLeadEvaluator";

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
            this.legalCards(
                hand,
                trick
            );

        if (legalCards.length === 0) {
            throw new Error(
                `No legal cards available for ${seat}`
            );
        }

        if (trick.cards.length === 0) {
            return this.chooseLead(
                legalCards
            );
        }

        const winningCards =
            legalCards.filter(card =>
                this.wouldCurrentlyWin(
                    seat,
                    card,
                    trick,
                    trump
                )
            );

        if (winningCards.length > 0) {
            return CardRanker.lowest(
                winningCards
            );
        }

        return CardRanker.lowest(
            legalCards
        );
    }

    static chooseDeclarerCard(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): Card {
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

        if (trick.cards.length === 0) {
            return this.chooseLead(
                legalCards
            );
        }

        const winningCards =
            legalCards.filter(card =>
                this.wouldCurrentlyWin(
                    seat,
                    card,
                    trick,
                    trump
                )
            );

        if (winningCards.length > 0) {
            return CardRanker.lowest(
                winningCards
            );
        }

        return CardRanker.lowest(
            legalCards
        );
    }

private static chooseLead(
    cards: Card[]
): Card {
    return OpeningLeadEvaluator
        .chooseLead(cards);
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