import {
    Card,
    Suit
} from "../cards/Card";

import { Hand } from "../cards/Hand";
import { Auction } from "./Auction";
import { Bid } from "./Bid";
import { BidExplanation } from "./BidExplanation";

interface HandFacts {
    highCardPoints: number;
    spades: number;
    hearts: number;
    diamonds: number;
    clubs: number;
    balanced: boolean;
}

export class BidExplainer {
    static explain(
        hand: Hand,
        auction: Auction,
        bid: Bid
    ): BidExplanation {
        const facts =
            this.evaluateHand(hand);

        if (bid.isPass()) {
            return this.explainPass(
                facts
            );
        }

        if (bid.isDouble()) {
            return this.explainDouble(
                auction,
                facts
            );
        }

        if (bid.isRedouble()) {
            return this.explainRedouble(
                facts
            );
        }

        if (
            !bid.isContract() ||
            bid.level === undefined ||
            bid.suit === undefined
        ) {
            return {
                title: "Bid",
                rule: "Unknown call",
                summary:
                    "No explanation is available.",
                highCardPoints:
                    facts.highCardPoints,
                facts: [],
                alternatives: []
            };
        }

        if (
            bid.level === 1 &&
            bid.suit === "NT"
        ) {
            return {
                title: "Why 1NT?",
                rule:
                    "15–17 HCP balanced opening",
                summary:
                    "The hand has the strength and shape for a Standard American 1NT opening.",
                highCardPoints:
                    facts.highCardPoints,
                facts: [
                    `${facts.highCardPoints} HCP`,
                    facts.balanced
                        ? "Balanced distribution"
                        : "Near-balanced distribution",
                    this.shapeText(facts)
                ],
                alternatives: [
                    "A suit opening was not preferred because the hand fits the 1NT range."
                ]
            };
        }

        if (
            bid.level === 2 &&
            bid.suit === Suit.Clubs &&
            this.partnerOpenedOneNotrump(
                auction
            )
        ) {
            return {
                title: "Why 2♣?",
                rule: "Stayman",
                summary:
                    "This asks the 1NT opener to show a four-card major.",
                highCardPoints:
                    facts.highCardPoints,
                facts: [
                    `${facts.highCardPoints} HCP`,
                    `${facts.spades} spades`,
                    `${facts.hearts} hearts`,
                    "Partner opened 1NT"
                ],
                alternatives: [
                    "A direct notrump bid would not search for a major-suit fit."
                ]
            };
        }

        if (
            bid.level === 2 &&
            bid.suit === Suit.Diamonds &&
            this.partnerOpenedOneNotrump(
                auction
            )
        ) {
            return {
                title: "Why 2♦?",
                rule:
                    "Jacoby transfer to hearts",
                summary:
                    "This asks partner to bid hearts.",
                highCardPoints:
                    facts.highCardPoints,
                facts: [
                    `${facts.hearts} hearts`,
                    `${facts.highCardPoints} HCP`,
                    "Partner opened 1NT"
                ],
                alternatives: [
                    "Bidding hearts directly would not use the transfer convention."
                ]
            };
        }

        if (
            bid.level === 2 &&
            bid.suit === Suit.Hearts &&
            this.partnerOpenedOneNotrump(
                auction
            )
        ) {
            return {
                title: "Why 2♥?",
                rule:
                    "Jacoby transfer to spades",
                summary:
                    "This asks partner to bid spades.",
                highCardPoints:
                    facts.highCardPoints,
                facts: [
                    `${facts.spades} spades`,
                    `${facts.highCardPoints} HCP`,
                    "Partner opened 1NT"
                ],
                alternatives: [
                    "Bidding spades directly would not use the transfer convention."
                ]
            };
        }

        const suitLength =
            bid.suit === "NT"
                ? 0
                : this.lengthOf(
                    bid.suit,
                    facts
                );

        return {
            title:
                `Why ${bid.toString()}?`,
            rule:
                this.contractRule(
                    bid,
                    auction
                ),
            summary:
                this.contractSummary(
                    bid,
                    auction
                ),
            highCardPoints:
                facts.highCardPoints,
            facts: [
                `${facts.highCardPoints} HCP`,
                bid.suit === "NT"
                    ? this.shapeText(facts)
                    : `${suitLength} cards in ${this.suitName(
                        bid.suit
                    )}`,
                facts.balanced
                    ? "Balanced hand"
                    : "Unbalanced hand"
            ],
            alternatives: [
                "Pass was rejected because the hand had sufficient values or distribution.",
                "Other legal strains were considered less descriptive."
            ]
        };
    }

    private static explainPass(
        facts: HandFacts
    ): BidExplanation {
        return {
            title: "Why Pass?",
            rule:
                "No constructive action selected",
            summary:
                "The hand did not meet the current strategy’s requirements for a bid, double, or redouble.",
            highCardPoints:
                facts.highCardPoints,
            facts: [
                `${facts.highCardPoints} HCP`,
                this.shapeText(facts)
            ],
            alternatives: [
                "A contract bid required more strength, length, or support.",
                "Double or redouble was either illegal or unsupported by the hand."
            ]
        };
    }

    private static explainDouble(
        auction: Auction,
        facts: HandFacts
    ): BidExplanation {
        const opponentBid =
            auction.lastContract();

        const opponentSuit =
            opponentBid?.suit;

        return {
            title: "Why Double?",
            rule:
                opponentSuit === "NT"
                    ? "Penalty-oriented double"
                    : "Takeout double",
            summary:
                opponentSuit === "NT"
                    ? "The hand is strong enough to challenge the opponents’ notrump contract."
                    : "The hand has opening strength, shortness in the opponent’s suit, and support for unbid suits.",
            highCardPoints:
                facts.highCardPoints,
            facts: [
                `${facts.highCardPoints} HCP`,
                opponentSuit &&
                opponentSuit !== "NT"
                    ? `${this.lengthOf(
                        opponentSuit,
                        facts
                    )} cards in the opponent’s suit`
                    : this.shapeText(facts),
                "Double is legal in the current auction"
            ],
            alternatives: [
                "A natural overcall was less descriptive.",
                "Pass was rejected because the hand had sufficient strength."
            ]
        };
    }

    private static explainRedouble(
        facts: HandFacts
    ): BidExplanation {
        return {
            title: "Why Redouble?",
            rule:
                "Strength after an opponent’s double",
            summary:
                "The opponents doubled our contract, and this hand has enough strength to redouble.",
            highCardPoints:
                facts.highCardPoints,
            facts: [
                `${facts.highCardPoints} HCP`,
                "Our partnership owns the contract",
                "The latest non-pass call was Double"
            ],
            alternatives: [
                "Pass would show less confidence in making the contract."
            ]
        };
    }

    private static contractRule(
        bid: Bid,
        auction: Auction
    ): string {
        if (!auction.lastContract()) {
            if (
                bid.suit ===
                    Suit.Hearts ||
                bid.suit ===
                    Suit.Spades
            ) {
                return "Five-card major opening";
            }

            if (
                bid.suit ===
                    Suit.Clubs ||
                bid.suit ===
                    Suit.Diamonds
            ) {
                return "Better-minor opening";
            }

            return "Natural opening bid";
        }

        return "Natural response or rebid";
    }

    private static contractSummary(
        bid: Bid,
        auction: Auction
    ): string {
        if (!auction.lastContract()) {
            return (
                `This opening bid describes strength and length in ` +
                `${bid.suit === "NT"
                    ? "notrump"
                    : this.suitName(
                        bid.suit!
                    )}.`
            );
        }

        return (
            "This is the cheapest available natural bid that best describes the hand."
        );
    }

    private static partnerOpenedOneNotrump(
        auction: Auction
    ): boolean {
        if (
            auction.calls.length === 0
        ) {
            return false;
        }

        const partnerSeat =
            this.partnerOf(
                auction.currentSeat
            );

        return auction.calls.some(
            call =>
                call.seat ===
                    partnerSeat &&
                call.bid.isContract() &&
                call.bid.level === 1 &&
                call.bid.suit === "NT"
        );
    }

    private static partnerOf(
        seat: string
    ): string {
        switch (seat) {
            case "North":
                return "South";

            case "East":
                return "West";

            case "South":
                return "North";

            case "West":
                return "East";

            default:
                return "";
        }
    }

    private static evaluateHand(
        hand: Hand
    ): HandFacts {
        const spades =
            this.countSuit(
                hand,
                Suit.Spades
            );

        const hearts =
            this.countSuit(
                hand,
                Suit.Hearts
            );

        const diamonds =
            this.countSuit(
                hand,
                Suit.Diamonds
            );

        const clubs =
            this.countSuit(
                hand,
                Suit.Clubs
            );

        const shape = [
            spades,
            hearts,
            diamonds,
            clubs
        ].sort(
            (
                first,
                second
            ) =>
                second - first
        );

        const shapeText =
            shape.join("-");

        return {
            highCardPoints:
                hand.cards.reduce(
                    (
                        total,
                        card
                    ) =>
                        total +
                        this.pointsForCard(
                            card
                        ),
                    0
                ),

            spades,
            hearts,
            diamonds,
            clubs,

            balanced:
                shapeText ===
                    "4-3-3-3" ||
                shapeText ===
                    "4-4-3-2" ||
                shapeText ===
                    "5-3-3-2"
        };
    }

    private static countSuit(
        hand: Hand,
        suit: Suit
    ): number {
        return hand.cards.filter(
            card =>
                card.suit === suit
        ).length;
    }

    private static pointsForCard(
        card: Card
    ): number {
        switch (card.rank) {
            case 14:
                return 4;

            case 13:
                return 3;

            case 12:
                return 2;

            case 11:
                return 1;

            default:
                return 0;
        }
    }

    private static lengthOf(
        suit: Suit,
        facts: HandFacts
    ): number {
        switch (suit) {
            case Suit.Spades:
                return facts.spades;

            case Suit.Hearts:
                return facts.hearts;

            case Suit.Diamonds:
                return facts.diamonds;

            case Suit.Clubs:
                return facts.clubs;
        }
    }

    private static shapeText(
        facts: HandFacts
    ): string {
        return (
            `Shape: ` +
            [
                facts.spades,
                facts.hearts,
                facts.diamonds,
                facts.clubs
            ].join("-")
        );
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