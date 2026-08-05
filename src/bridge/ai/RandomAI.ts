import { BridgeAI } from "./BridgeAI";

import { Card } from "../cards/Card";
import { Hand } from "../cards/Hand";

import { Seat } from "../core/Seat";

import {
    TrumpSuit
} from "../play/Contract";

import {
    PlayValidator
} from "../play/PlayValidator";

import { Trick } from "../play/Trick";

import {
    PlayDecision
} from "./PlayDecision";

export class RandomAI
implements BridgeAI {
    chooseDecision(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): PlayDecision {
        const legalCards =
            hand.cards.filter(
                card =>
                    PlayValidator
                        .isLegalPlay(
                            hand,
                            card,
                            trick.leadSuit
                        )
            );

        if (legalCards.length === 0) {
            throw new Error(
                `No legal cards available for ${seat}`
            );
        }

        const index =
            Math.floor(
                Math.random() *
                legalCards.length
            );

        const card =
            legalCards[index];

        return {
            card,

            explanation: {
                title:
                    "Why this card?",

                rule:
                    "Random legal play",

                summary:
                    "RandomAI selected one of the legal cards at random.",

                facts: [
                    `${legalCards.length} legal cards were available`,
                    trick.leadSuit === undefined
                        ? "The player was on lead"
                        : card.suit === trick.leadSuit
                            ? "The card followed suit"
                            : "The player could not follow suit"
                ],

                alternatives: [
                    "Every other legal card had an equal chance of being selected."
                ]
            }
        };
    }

    chooseCard(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): Card {
        return this.chooseDecision(
            seat,
            hand,
            trick,
            trump
        ).card;
    }
}