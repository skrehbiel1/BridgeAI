import {
    Card,
    Suit
} from "../cards/Card";

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
    TrickWinner
} from "../play/TrickWinner";

import {
    CardRanker
} from "./CardRanker";

import {
    OpeningLeadEvaluator
} from "./OpeningLeadEvaluator";

import {
    PlayDecision
} from "./PlayDecision";

export class TrickPlayEvaluator {
    static legalCards(
        hand: Hand,
        trick: Trick
    ): Card[] {
        return hand.cards.filter(
            card =>
                PlayValidator.isLegalPlay(
                    hand,
                    card,
                    trick.leadSuit
                )
        );
    }

    static chooseDefensiveDecision(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): PlayDecision {
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
            const card =
                OpeningLeadEvaluator
                    .chooseLead(
                        legalCards
                    );

            return {
                card,

                explanation: {
                    title:
                        `Why ${this.cardText(
                            card
                        )}?`,

                    rule:
                        "Opening lead",

                    summary:
                        "The defensive lead evaluator selected this card as the preferred opening lead from the available suits.",

                    facts: [
                        `${legalCards.length} legal cards were available`,
                        this.cardSuitFact(
                            card,
                            hand
                        ),
                        "No suit had yet been led"
                    ],

                    alternatives: [
                        "Other legal leads were ranked lower by the opening-lead evaluator."
                    ]
                }
            };
        }

        /*
         * Second hand low.
         */
        if (trick.cards.length === 1) {
            const card =
                CardRanker.lowest(
                    legalCards
                );

            return {
                card,

                explanation: {
                    title:
                        `Why ${this.cardText(
                            card
                        )}?`,

                    rule:
                        "Second hand low",

                    summary:
                        "The defender played the lowest legal card to conserve higher cards for later tricks.",

                    facts: [
                        this.followSuitFact(
                            card,
                            trick
                        ),
                        `${legalCards.length} legal cards were available`,
                        "Only one opponent had played to the trick"
                    ],

                    alternatives: [
                        "A higher card was not needed under the current simple defensive rule.",
                        "Covering honors will be added as a later exception."
                    ]
                }
            };
        }

        const winningCard =
            this.lowestWinningCard(
                seat,
                legalCards,
                trick,
                trump
            );

        if (winningCard) {
            return {
                card: winningCard,

                explanation: {
                    title:
                        `Why ${this.cardText(
                            winningCard
                        )}?`,

                    rule:
                        "Win as cheaply as possible",

                    summary:
                        "This was the lowest legal card that would currently win the trick.",

                    facts: [
                        this.followSuitFact(
                            winningCard,
                            trick
                        ),
                        "The card becomes the current trick winner",
                        "Higher winning cards were conserved"
                    ],

                    alternatives: [
                        "Playing lower would not win the trick.",
                        "Playing higher would spend an unnecessary card."
                    ]
                }
            };
        }

        const card =
            CardRanker.lowest(
                legalCards
            );

        return {
            card,

            explanation: {
                title:
                    `Why ${this.cardText(
                        card
                    )}?`,

                rule:
                    "Conserve strength",

                summary:
                    "No legal card could currently win, so the defender played the lowest legal card.",

                facts: [
                    this.followSuitFact(
                        card,
                        trick
                    ),
                    "No available card would take the trick",
                    "Higher cards were preserved"
                ],

                alternatives: [
                    "A higher card would still lose the trick.",
                    "The lowest losing card was therefore preferred."
                ]
            }
        };
    }

    static chooseDeclarerDecision(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): PlayDecision {
        const legalCards =
            this.requireLegalCards(
                seat,
                hand,
                trick
            );

        /*
         * Declarer or dummy leads.
         */
        if (trick.cards.length === 0) {
            const card =
                OpeningLeadEvaluator
                    .chooseLead(
                        legalCards
                    );

            return {
                card,

                explanation: {
                    title:
                        `Why ${this.cardText(
                            card
                        )}?`,

                    rule:
                        "Lead from the preferred suit",

                    summary:
                        "The current declarer-play evaluator selected this card as the preferred lead.",

                    facts: [
                        `${legalCards.length} cards were available`,
                        this.cardSuitFact(
                            card,
                            hand
                        ),
                        "Declarer or dummy was on lead"
                    ],

                    alternatives: [
                        "Other leads were ranked lower by the current evaluator.",
                        "Full declarer planning and entry management will be added later."
                    ]
                }
            };
        }

        const winningCard =
            this.lowestWinningCard(
                seat,
                legalCards,
                trick,
                trump
            );

        if (winningCard) {
            return {
                card: winningCard,

                explanation: {
                    title:
                        `Why ${this.cardText(
                            winningCard
                        )}?`,

                    rule:
                        "Win with the lowest sufficient card",

                    summary:
                        "This was the least expensive legal card that would currently win the trick.",

                    facts: [
                        this.followSuitFact(
                            winningCard,
                            trick
                        ),
                        "The card becomes the current winner",
                        "Higher cards remain available"
                    ],

                    alternatives: [
                        "A lower card would not currently win.",
                        "A higher card was unnecessary."
                    ]
                }
            };
        }

        const card =
            CardRanker.lowest(
                legalCards
            );

        return {
            card,

            explanation: {
                title:
                    `Why ${this.cardText(
                        card
                    )}?`,

                rule:
                    "Play low when unable to win",

                summary:
                    "No legal card would currently win the trick, so the lowest legal card was selected.",

                facts: [
                    this.followSuitFact(
                        card,
                        trick
                    ),
                    "No available card could take the trick",
                    "Higher cards were conserved"
                ],

                alternatives: [
                    "A higher card would also lose.",
                    "The lowest legal card minimized the cost."
                ]
            }
        };
    }

    /*
     * Compatibility methods.
     */
    static chooseDefensiveCard(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): Card {
        return this.chooseDefensiveDecision(
            seat,
            hand,
            trick,
            trump
        ).card;
    }

    static chooseDeclarerCard(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): Card {
        return this.chooseDeclarerDecision(
            seat,
            hand,
            trick,
            trump
        ).card;
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
            legalCards.filter(
                card =>
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

    private static followSuitFact(
        card: Card,
        trick: Trick
    ): string {
        if (
            trick.leadSuit ===
            undefined
        ) {
            return "This card established the lead suit";
        }

        if (
            card.suit ===
            trick.leadSuit
        ) {
            return (
                `Followed suit in ` +
                `${this.suitName(
                    card.suit
                )}`
            );
        }

        return (
            `Unable to follow ` +
            `${this.suitName(
                trick.leadSuit
            )}`
        );
    }

    private static cardSuitFact(
        card: Card,
        hand: Hand
    ): string {
        const suitLength =
            hand.cards.filter(
                candidate =>
                    candidate.suit ===
                    card.suit
            ).length;

        return (
            `${suitLength} cards were held in ` +
            `${this.suitName(
                card.suit
            )}`
        );
    }

    private static cardText(
        card: Card
    ): string {
        return (
            `${this.rankText(
                card.rank
            )}` +
            `${this.suitSymbol(
                card.suit
            )}`
        );
    }

    private static rankText(
        rank: number
    ): string {
        switch (rank) {
            case 14:
                return "A";

            case 13:
                return "K";

            case 12:
                return "Q";

            case 11:
                return "J";

            default:
                return String(rank);
        }
    }

    private static suitSymbol(
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

    private static suitName(
        suit: Suit
    ): string {
        switch (suit) {
            case Suit.Spades:
                return "spades";

            case Suit.Hearts:
                return "hearts";

            case Suit.Diamonds:
                return "diamonds";

            case Suit.Clubs:
                return "clubs";
        }
    }
}