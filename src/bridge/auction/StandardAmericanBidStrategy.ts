import {
    Card,
    Suit
} from "../cards/Card";

import { Hand } from "../cards/Hand";

import {
    partnershipOf
} from "../core/Partnership";

import {
    Seat,
    nextSeat
} from "../core/Seat";

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

interface HandEvaluation {
    highCardPoints: number;
    balanced: boolean;

    lengths: Record<
        Suit,
        number
    >;
}

export class StandardAmericanBidStrategy
implements BidStrategy {
    chooseBid(
        hand: Hand,
        auction: Auction
    ): Bid {
        const evaluation =
            this.evaluateHand(
                hand
            );

        /*
         * 1. Opening bid
         */
        if (!auction.lastContract()) {
            return this.chooseOpeningBid(
                hand,
                auction,
                evaluation
            );
        }

        /*
         * Redouble after the opponents double
         * our partnership's contract.
         */
        if (
            auction.canRedouble() &&
            evaluation.highCardPoints >= 10
        ) {
            return Bid.Redouble();
        }

        /*
         * 2. Competitive auction
         *
         * The opponents currently own the
         * contract.
         */
        if (
            this.opponentsOwnContract(
                auction
            )
        ) {
            return this.chooseCompetitiveBid(
                hand,
                auction,
                evaluation
            );
        }

        /*
         * 3. Response to partner
         */
        if (
            this.isRespondingToPartner(
                auction
            )
        ) {
            return this.chooseResponse(
                hand,
                auction,
                evaluation
            );
        }

        /*
         * 4. Opener's rebid
         */
        if (
            this.isOpenerRebid(
                auction
            )
        ) {
            return this.chooseOpenerRebid(
                hand,
                auction,
                evaluation
            );
        }

        return this.chooseGeneralContinuation(
            hand,
            auction,
            evaluation
        );
    }

    /*
     * =====================================================
     * OPENING BIDS
     * =====================================================
     */

    private chooseOpeningBid(
        hand: Hand,
        auction: Auction,
        evaluation: HandEvaluation
    ): Bid {
        const {
            highCardPoints,
            balanced,
            lengths
        } = evaluation;

        /*
         * 15–17 HCP balanced 1NT opening.
         */
        if (
            highCardPoints >= 15 &&
            highCardPoints <= 17 &&
            balanced
        ) {
            return this.contractOrPass(
                auction,
                1,
                "NT"
            );
        }

        /*
         * Basic one-level opening range.
         */
        if (
            highCardPoints < 12 ||
            highCardPoints > 21
        ) {
            return Bid.Pass();
        }

        /*
         * Five-card majors.
         *
         * With equal five-card majors,
         * open spades.
         */
        if (
            lengths[Suit.Spades] >= 5 &&
            lengths[Suit.Spades] >=
                lengths[Suit.Hearts]
        ) {
            return this.contractOrPass(
                auction,
                1,
                Suit.Spades
            );
        }

        if (
            lengths[Suit.Hearts] >= 5
        ) {
            return this.contractOrPass(
                auction,
                1,
                Suit.Hearts
            );
        }

        /*
         * Better minor.
         *
         * With equal minors, this version
         * opens diamonds.
         */
        if (
            lengths[Suit.Diamonds] >=
            lengths[Suit.Clubs]
        ) {
            return this.contractOrPass(
                auction,
                1,
                Suit.Diamonds
            );
        }

        return this.contractOrPass(
            auction,
            1,
            Suit.Clubs
        );
    }

    /*
     * =====================================================
     * RESPONSES
     * =====================================================
     */

private chooseResponse(
    hand: Hand,
    auction: Auction,
    evaluation: HandEvaluation
): Bid {
    const partnerCall =
        this.partnerLastContractCall(
            auction
        );

    if (!partnerCall) {
        return Bid.Pass();
    }

    const partnerLevel =
        partnerCall.bid.level;

    const partnerSuit =
        partnerCall.bid.suit;

    if (
        partnerLevel === undefined ||
        partnerSuit === undefined
    ) {
        return Bid.Pass();
    }

    /*
     * Responses to 1NT:
     *
     * 2♣ = Stayman
     * 2♦ = transfer to hearts
     * 2♥ = transfer to spades
     */
    if (
        partnerLevel === 1 &&
        partnerSuit === "NT"
    ) {
        return this.chooseOneNotrumpResponse(
            auction,
            evaluation
        );
    }

    const hcp =
        evaluation.highCardPoints;

    if (hcp < 6) {
        return Bid.Pass();
    }

    /*
     * Raise partner with at least
     * three-card support.
     */
    if (partnerSuit !== "NT") {
        const supportLength =
            evaluation.lengths[
                partnerSuit
            ];

        if (supportLength >= 3) {
            return this.chooseRaise(
                auction,
                partnerLevel,
                partnerSuit,
                hcp
            );
        }
    }

    /*
     * Bid a new four-card major.
     */
    const majorResponse =
        this.chooseNewMajorResponse(
            auction,
            evaluation
        );

    if (majorResponse) {
        return majorResponse;
    }

    /*
     * Bid another useful four-card suit.
     */
    const newSuit =
        this.chooseNewSuitResponse(
            auction,
            evaluation
        );

    if (newSuit) {
        return newSuit;
    }

    /*
     * Balanced responses.
     */
    if (evaluation.balanced) {
        if (hcp >= 10) {
            const threeNotrump =
                Bid.Contract(
                    3,
                    "NT"
                );

            if (
                auction.isLegalBid(
                    threeNotrump
                )
            ) {
                return threeNotrump;
            }
        }

        if (hcp >= 6) {
            const oneNotrump =
                Bid.Contract(
                    1,
                    "NT"
                );

            if (
                auction.isLegalBid(
                    oneNotrump
                )
            ) {
                return oneNotrump;
            }
        }
    }

    return Bid.Pass();
}

    private chooseOneNotrumpResponse(
        auction: Auction,
        evaluation: HandEvaluation
    ): Bid {
        const hcp =
            evaluation.highCardPoints;

        const hearts =
            evaluation.lengths[
                Suit.Hearts
            ];

        const spades =
            evaluation.lengths[
                Suit.Spades
            ];

        /*
         * Jacoby transfer to hearts.
         */
        if (hearts >= 5) {
            return this.contractOrPass(
                auction,
                2,
                Suit.Diamonds
            );
        }

        /*
         * Jacoby transfer to spades.
         */
        if (spades >= 5) {
            return this.contractOrPass(
                auction,
                2,
                Suit.Hearts
            );
        }

        /*
         * Stayman with an invitational or
         * better hand and a four-card major.
         */
        if (
            hcp >= 8 &&
            (
                hearts >= 4 ||
                spades >= 4
            )
        ) {
            return this.contractOrPass(
                auction,
                2,
                Suit.Clubs
            );
        }

        /*
         * Invitational balanced response.
         */
        if (
            hcp >= 8 &&
            hcp <= 9 &&
            evaluation.balanced
        ) {
            return this.contractOrPass(
                auction,
                2,
                "NT"
            );
        }

        /*
         * Game-going balanced response.
         */
        if (
            hcp >= 10 &&
            evaluation.balanced
        ) {
            return this.contractOrPass(
                auction,
                3,
                "NT"
            );
        }

        return Bid.Pass();
    }

    private chooseRaise(
        auction: Auction,
        partnerLevel: number,
        partnerSuit: Suit,
        highCardPoints: number
    ): Bid {
        /*
         * Simple raise: approximately 6–9 HCP.
         */
        if (
            highCardPoints >= 6 &&
            highCardPoints <= 9
        ) {
            return this.contractOrPass(
                auction,
                Math.min(
                    partnerLevel + 1,
                    7
                ),
                partnerSuit
            );
        }

        /*
         * Invitational raise: approximately
         * 10–12 HCP.
         */
        if (
            highCardPoints >= 10 &&
            highCardPoints <= 12
        ) {
            return this.contractOrPass(
                auction,
                Math.min(
                    partnerLevel + 2,
                    7
                ),
                partnerSuit
            );
        }

        /*
         * Game-forcing strength.
         */
        if (highCardPoints >= 13) {
            const gameLevel =
                partnerSuit ===
                    Suit.Hearts ||
                partnerSuit ===
                    Suit.Spades
                    ? 4
                    : 5;

            return this.contractOrPass(
                auction,
                gameLevel,
                partnerSuit
            );
        }

        return Bid.Pass();
    }

    private chooseNewMajorResponse(
        auction: Auction,
        evaluation: HandEvaluation
    ): Bid | undefined {
        if (
            evaluation.lengths[
                Suit.Spades
            ] >= 4
        ) {
            const spadeBid =
                this.cheapestLegalBidInSuit(
                    auction,
                    Suit.Spades,
                    2
                );

            if (spadeBid) {
                return spadeBid;
            }
        }

        if (
            evaluation.lengths[
                Suit.Hearts
            ] >= 4
        ) {
            const heartBid =
                this.cheapestLegalBidInSuit(
                    auction,
                    Suit.Hearts,
                    2
                );

            if (heartBid) {
                return heartBid;
            }
        }

        return undefined;
    }

    private chooseNewSuitResponse(
        auction: Auction,
        evaluation: HandEvaluation
    ): Bid | undefined {
        const orderedSuits =
            this.suitsByLength(
                evaluation
            );

        for (
            const suit of orderedSuits
        ) {
            if (
                evaluation.lengths[
                    suit
                ] < 4
            ) {
                continue;
            }

            const bid =
                this.cheapestLegalBidInSuit(
                    auction,
                    suit,
                    2
                );

            if (bid) {
                return bid;
            }
        }

        return undefined;
    }

    /*
     * =====================================================
     * OPENER'S REBID
     * =====================================================
     */

    private chooseOpenerRebid(
        hand: Hand,
        auction: Auction,
        evaluation: HandEvaluation
    ): Bid {
        const myPreviousCall =
            this.currentPlayerLastContractCall(
                auction
            );

        const partnerCall =
            this.partnerLastContractCall(
                auction
            );

        if (
            !myPreviousCall ||
            !partnerCall ||
            myPreviousCall.bid.suit ===
                undefined ||
            partnerCall.bid.suit ===
                undefined
        ) {
            return Bid.Pass();
        }

        const mySuit =
            myPreviousCall.bid.suit;

        const partnerSuit =
            partnerCall.bid.suit;

        const hcp =
            evaluation.highCardPoints;

        /*
         * Partner raised opener's suit.
         */
        if (
            mySuit !== "NT" &&
            partnerSuit === mySuit
        ) {
            /*
             * With minimum values, accept the
             * simple raise by passing.
             */
            if (hcp <= 15) {
                return Bid.Pass();
            }

            /*
             * Bid game with extra values.
             */
            const gameLevel =
                mySuit === Suit.Hearts ||
                mySuit === Suit.Spades
                    ? 4
                    : 5;

            return this.contractOrPass(
                auction,
                gameLevel,
                mySuit
            );
        }

        /*
         * Support partner's new suit with
         * at least four cards.
         */
        if (
            partnerSuit !== "NT" &&
            evaluation.lengths[
                partnerSuit
            ] >= 4
        ) {
            const supportBid =
                this.cheapestLegalBidInSuit(
                    auction,
                    partnerSuit,
                    3
                );

            if (supportBid) {
                return supportBid;
            }
        }

        /*
         * 18–19 balanced opener rebids 2NT.
         */
        if (
            hcp >= 18 &&
            hcp <= 19 &&
            evaluation.balanced
        ) {
            const twoNotrump =
                Bid.Contract(
                    2,
                    "NT"
                );

            if (
                auction.isLegalBid(
                    twoNotrump
                )
            ) {
                return twoNotrump;
            }
        }

        /*
         * Rebid a six-card opening suit.
         */
        if (
            mySuit !== "NT" &&
            evaluation.lengths[
                mySuit
            ] >= 6
        ) {
            const rebid =
                this.cheapestLegalBidInSuit(
                    auction,
                    mySuit,
                    3
                );

            if (rebid) {
                return rebid;
            }
        }

        /*
         * Minimum balanced hand.
         */
        if (
            evaluation.balanced
        ) {
            const oneNotrump =
                Bid.Contract(
                    1,
                    "NT"
                );

            if (
                auction.isLegalBid(
                    oneNotrump
                )
            ) {
                return oneNotrump;
            }
        }

        return Bid.Pass();
    }

    /*
     * =====================================================
     * COMPETITIVE BIDDING
     * =====================================================
     */

    private chooseCompetitiveBid(
        hand: Hand,
        auction: Auction,
        evaluation: HandEvaluation
    ): Bid {
        /*
         * Standard-style takeout double.
         */
        if (
            auction.canDouble() &&
            this.shouldMakeTakeoutDouble(
                auction,
                evaluation
            )
        ) {
            return Bid.Double();
        }

        /*
         * Basic natural overcall:
         *
         * 8+ HCP and a five-card suit.
         */
        if (
            evaluation.highCardPoints >= 8
        ) {
            const orderedSuits =
                this.suitsByLength(
                    evaluation
                );

            for (
                const suit of orderedSuits
            ) {
                if (
                    evaluation.lengths[
                        suit
                    ] < 5
                ) {
                    continue;
                }

                const overcall =
                    this.cheapestLegalBidInSuit(
                        auction,
                        suit,
                        2
                    );

                if (overcall) {
                    return overcall;
                }
            }
        }

        /*
         * Penalty-oriented double of 1NT
         * with a strong balanced hand.
         */
        const opponentContract =
            auction.lastContract();

        if (
            auction.canDouble() &&
            opponentContract?.suit ===
                "NT" &&
            evaluation.highCardPoints >=
                15
        ) {
            return Bid.Double();
        }

        return Bid.Pass();
    }

    private shouldMakeTakeoutDouble(
        auction: Auction,
        evaluation: HandEvaluation
    ): boolean {
        const opponentContract =
            auction.lastContract();

        if (
            !opponentContract ||
            opponentContract.suit ===
                undefined ||
            opponentContract.suit ===
                "NT"
        ) {
            return false;
        }

        if (
            evaluation.highCardPoints < 12
        ) {
            return false;
        }

        const opponentSuit =
            opponentContract.suit;

        /*
         * Typical takeout shape includes
         * shortness in the opponents' suit.
         */
        if (
            evaluation.lengths[
                opponentSuit
            ] > 2
        ) {
            return false;
        }

        const unbidSuits =
            this.allSuits()
                .filter(
                    suit =>
                        suit !==
                        opponentSuit
                );

        const supportedUnbidSuits =
            unbidSuits.filter(
                suit =>
                    evaluation.lengths[
                        suit
                    ] >= 3
            ).length;

        /*
         * Require support for at least two of
         * the three unbid suits.
         */
        return (
            supportedUnbidSuits >= 2
        );
    }

    /*
     * =====================================================
     * GENERAL CONTINUATION
     * =====================================================
     */

    private chooseGeneralContinuation(
        hand: Hand,
        auction: Auction,
        evaluation: HandEvaluation
    ): Bid {
        if (
            evaluation.highCardPoints < 10
        ) {
            return Bid.Pass();
        }

        const preferredSuit =
            this.longestSuit(
                hand
            );

        const suitBid =
            this.cheapestLegalBidInSuit(
                auction,
                preferredSuit,
                3
            );

        if (suitBid) {
            return suitBid;
        }

        if (evaluation.balanced) {
            const notrumpBid =
                auction
                    .legalContractBids()
                    .find(
                        bid =>
                            bid.isContract() &&
                            bid.level !==
                                undefined &&
                            bid.suit ===
                                "NT" &&
                            bid.level <= 3
                    );

            if (notrumpBid) {
                return notrumpBid;
            }
        }

        return Bid.Pass();
    }

    /*
     * =====================================================
     * AUCTION CONTEXT HELPERS
     * =====================================================
     */

    private isRespondingToPartner(
        auction: Auction
    ): boolean {
        const currentSeat =
            auction.currentSeat;

        const partner =
            this.partnerOf(
                currentSeat
            );

        const currentPlayerHasBid =
            auction.calls.some(
                call =>
                    call.seat ===
                        currentSeat &&
                    call.bid.isContract()
            );

        if (currentPlayerHasBid) {
            return false;
        }

        const partnerHasBid =
            auction.calls.some(
                call =>
                    call.seat === partner &&
                    call.bid.isContract()
            );

        return partnerHasBid;
    }

    private isOpenerRebid(
        auction: Auction
    ): boolean {
        const currentSeat =
            auction.currentSeat;

        const partner =
            this.partnerOf(
                currentSeat
            );

        const currentPlayerCalls =
            auction.calls.filter(
                call =>
                    call.seat ===
                        currentSeat &&
                    call.bid.isContract()
            );

        if (
            currentPlayerCalls.length === 0
        ) {
            return false;
        }

        const partnerHasResponded =
            auction.calls.some(
                call =>
                    call.seat === partner &&
                    call.bid.isContract()
            );

        return partnerHasResponded;
    }

    private opponentsOwnContract(
        auction: Auction
    ): boolean {
        const contractCall =
            auction.lastContractCall();

        if (!contractCall) {
            return false;
        }

        return (
            partnershipOf(
                contractCall.seat
            ) !==
            partnershipOf(
                auction.currentSeat
            )
        );
    }

    private partnerLastContractCall(
        auction: Auction
    ) {
        const partner =
            this.partnerOf(
                auction.currentSeat
            );

        for (
            let index =
                auction.calls.length - 1;
            index >= 0;
            index--
        ) {
            const call =
                auction.calls[index];

            if (
                call.seat === partner &&
                call.bid.isContract()
            ) {
                return call;
            }
        }

        return undefined;
    }

    private currentPlayerLastContractCall(
        auction: Auction
    ) {
        const currentSeat =
            auction.currentSeat;

        for (
            let index =
                auction.calls.length - 1;
            index >= 0;
            index--
        ) {
            const call =
                auction.calls[index];

            if (
                call.seat ===
                    currentSeat &&
                call.bid.isContract()
            ) {
                return call;
            }
        }

        return undefined;
    }

    private partnerOf(
        seat: Seat
    ): Seat {
        return nextSeat(
            nextSeat(seat)
        );
    }

    /*
     * =====================================================
     * BID HELPERS
     * =====================================================
     */

    private contractOrPass(
        auction: Auction,
        level: number,
        suit: BidSuit
    ): Bid {
        const bid =
            Bid.Contract(
                level,
                suit
            );

        return auction.isLegalBid(bid)
            ? bid
            : Bid.Pass();
    }

    private cheapestLegalBidInSuit(
        auction: Auction,
        suit: BidSuit,
        maximumLevel: number
    ): Bid | undefined {
        return auction
            .legalContractBids()
            .find(
                bid =>
                    bid.isContract() &&
                    bid.level !==
                        undefined &&
                    bid.suit === suit &&
                    bid.level <=
                        maximumLevel
            );
    }

    /*
     * =====================================================
     * HAND EVALUATION
     * =====================================================
     */

    private evaluateHand(
        hand: Hand
    ): HandEvaluation {
        const lengths = {
            [Suit.Spades]:
                this.suitLength(
                    hand,
                    Suit.Spades
                ),

            [Suit.Hearts]:
                this.suitLength(
                    hand,
                    Suit.Hearts
                ),

            [Suit.Diamonds]:
                this.suitLength(
                    hand,
                    Suit.Diamonds
                ),

            [Suit.Clubs]:
                this.suitLength(
                    hand,
                    Suit.Clubs
                )
        };

        return {
            highCardPoints:
                this.highCardPoints(
                    hand.cards
                ),

            balanced:
                this.isBalancedFromLengths(
                    lengths
                ),

            lengths
        };
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
    ): Suit {
        return this.suitsByLength(
            this.evaluateHand(hand)
        )[0];
    }

    private suitsByLength(
        evaluation: HandEvaluation
    ): Suit[] {
        return this.allSuits()
            .sort(
                (
                    first,
                    second
                ) => {
                    const lengthDifference =
                        evaluation.lengths[
                            second
                        ] -
                        evaluation.lengths[
                            first
                        ];

                    if (
                        lengthDifference !== 0
                    ) {
                        return lengthDifference;
                    }

                    return (
                        this.suitPreference(
                            second
                        ) -
                        this.suitPreference(
                            first
                        )
                    );
                }
            );
    }

    private suitLength(
        hand: Hand,
        suit: Suit
    ): number {
        return hand.cards.filter(
            card =>
                card.suit === suit
        ).length;
    }

    private isBalancedFromLengths(
        lengths: Record<
            Suit,
            number
        >
    ): boolean {
        const shape = [
            lengths[Suit.Spades],
            lengths[Suit.Hearts],
            lengths[Suit.Diamonds],
            lengths[Suit.Clubs]
        ]
            .sort(
                (
                    first,
                    second
                ) =>
                    second - first
            )
            .join("-");

        return (
            shape === "4-3-3-3" ||
            shape === "4-4-3-2" ||
            shape === "5-3-3-2"
        );
    }

    private allSuits():
        Suit[] {
        return [
            Suit.Spades,
            Suit.Hearts,
            Suit.Diamonds,
            Suit.Clubs
        ];
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