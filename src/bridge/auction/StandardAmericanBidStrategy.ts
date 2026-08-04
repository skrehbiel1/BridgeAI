import {
    Card,
    Suit
} from "../cards/Card";

import { Hand } from "../cards/Hand";

import { Auction } from "./Auction";
import { BidStrategy } from "./BidStrategy";

import {
    Bid,
    BidSuit
} from "./Bid";

interface SuitLength {
    suit: Suit;
    length: number;
}

export class StandardAmericanBidStrategy
implements BidStrategy {
    chooseBid(
        hand: Hand,
        auction: Auction
    ): Bid {
        const highCardPoints =
            this.highCardPoints(
                hand.cards
            );

        if (!auction.lastContract()) {
            return this.chooseOpeningBid(
                hand,
                highCardPoints
            );
        }

        if (highCardPoints < 10) {
            return Bid.Pass();
        }

        const preferredSuit =
            this.longestSuit(hand);

const legalSuitBid =
    auction
        .legalContractBids()
        .find(
            bid =>
                bid.isContract() &&
                bid.level !== undefined &&
                bid.suit ===
                    preferredSuit &&
                bid.level <= 3
        );


        if (legalSuitBid) {
            return legalSuitBid;
        }

        if (this.isBalanced(hand)) {
const legalNotrumpBid =
    auction
        .legalContractBids()
        .find(
            bid =>
                bid.isContract() &&
                bid.level !== undefined &&
                bid.suit ===
                    "NT" &&
                bid.level <= 3
        );

            if (legalNotrumpBid) {
                return legalNotrumpBid;
            }
        }

        return Bid.Pass();
    }

    private chooseOpeningBid(
        hand: Hand,
        highCardPoints: number
    ): Bid {
        if (highCardPoints < 12) {
            return Bid.Pass();
        }

        if (
            highCardPoints >= 15 &&
            highCardPoints <= 17 &&
            this.isBalanced(hand)
        ) {
            return Bid.Contract(
                1,
                "NT"
            );
        }

        return Bid.Contract(
            1,
            this.longestSuit(hand)
        );
    }

    private highCardPoints(
        cards: Card[]
    ): number {
        return cards.reduce(
            (
                total,
                card
            ) =>
                total +
                this.pointsForRank(
                    card.rank
                ),
            0
        );
    }

    private pointsForRank(
        rank: number
    ): number {
        switch (rank) {
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

    private longestSuit(
        hand: Hand
    ): BidSuit {
        const lengths =
            this.suitLengths(hand);

        lengths.sort(
            (
                first,
                second
            ) => {
                if (
                    first.length !==
                    second.length
                ) {
                    return (
                        second.length -
                        first.length
                    );
                }

                return (
                    this.suitPreference(
                        second.suit
                    ) -
                    this.suitPreference(
                        first.suit
                    )
                );
            }
        );

        return lengths[0].suit;
    }

    private isBalanced(
        hand: Hand
    ): boolean {
        const lengths =
            this.suitLengths(hand)
                .map(
                    entry =>
                        entry.length
                )
                .sort(
                    (
                        first,
                        second
                    ) =>
                        second - first
                );

        const shape =
            lengths.join("-");

        return (
            shape === "4-3-3-3" ||
            shape === "4-4-3-2" ||
            shape === "5-3-3-2"
        );
    }

    private suitLengths(
        hand: Hand
    ): SuitLength[] {
        return [
            Suit.Spades,
            Suit.Hearts,
            Suit.Diamonds,
            Suit.Clubs
        ].map(
            suit => ({
                suit,
                length:
                    hand.cards.filter(
                        card =>
                            card.suit === suit
                    ).length
            })
        );
    }

    private suitPreference(
        suit: Suit
    ): number {
        switch (suit) {
            case Suit.Spades:
                return 4;

            case Suit.Hearts:
                return 3;

            case Suit.Diamonds:
                return 2;

            case Suit.Clubs:
                return 1;
        }
    }
}