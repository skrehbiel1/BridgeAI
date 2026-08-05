import { Suit } from "../cards/Card";

import {
    Seat,
    nextSeat
} from "../core/Seat";

import {
    partnershipOf
} from "../core/Partnership";

import {
    Contract,
    ContractMultiplier
} from "../play/Contract";

import {
    AuctionCall
} from "./AuctionCall";

import {
    BidExplanation
} from "./BidExplanation";

import {
    Bid,
    BidSuit
} from "./Bid";

const BID_SUITS:
    BidSuit[] = [
        Suit.Clubs,
        Suit.Diamonds,
        Suit.Hearts,
        Suit.Spades,
        "NT"
    ];

const BID_SUIT_ORDER:
    Record<BidSuit, number> = {
        [Suit.Clubs]: 0,
        [Suit.Diamonds]: 1,
        [Suit.Hearts]: 2,
        [Suit.Spades]: 3,
        NT: 4
    };

export class Auction {
    readonly calls:
        AuctionCall[] = [];

    currentSeat: Seat;

    constructor(
        public dealer:
            Seat = Seat.North
    ) {
        this.currentSeat =
            dealer;
    }

    /*
     * Compatibility helper for code that still
     * reads auction.bids.
     */
    get bids(): Bid[] {
        return this.calls.map(
            call => call.bid
        );
    }

addBid(
    bid: Bid,
    explanation?:
        BidExplanation
): boolean {
        if (
            this.isComplete() ||
            !this.isLegalBid(bid)
        ) {
            return false;
        }

this.calls.push(
    new AuctionCall(
        this.currentSeat,
        bid,
        explanation
    )
);

        if (!this.isComplete()) {
            this.currentSeat =
                nextSeat(
                    this.currentSeat
                );
        }

        return true;
    }

    isLegalBid(
        bid: Bid
    ): boolean {
        if (bid.isPass()) {
            return true;
        }

        if (bid.isDouble()) {
            return this.canDouble();
        }

        if (bid.isRedouble()) {
            return this.canRedouble();
        }

        if (
            !bid.isContract() ||
            bid.level === undefined ||
            bid.suit === undefined
        ) {
            return false;
        }

        if (
            bid.level < 1 ||
            bid.level > 7
        ) {
            return false;
        }

        const previousContract =
            this.lastContract();

        if (!previousContract) {
            return true;
        }

        return (
            this.bidValue(bid) >
            this.bidValue(
                previousContract
            )
        );
    }

    canDouble(): boolean {
        const contractCall =
            this.lastContractCall();

        if (!contractCall) {
            return false;
        }

        /*
         * A double is legal only when the most
         * recent non-pass call is a contract bid.
         *
         * Passes may occur between that contract
         * bid and the double.
         */
        const lastNonPassCall =
            this.lastNonPassCall();

        if (
            !lastNonPassCall ||
            !lastNonPassCall.bid
                .isContract()
        ) {
            return false;
        }

        /*
         * The player doubling must be on the
         * opposing partnership.
         */
        return (
            partnershipOf(
                this.currentSeat
            ) !==
            partnershipOf(
                contractCall.seat
            )
        );
    }

    canRedouble(): boolean {
        const contractCall =
            this.lastContractCall();

        if (!contractCall) {
            return false;
        }

        /*
         * A redouble is legal only when the most
         * recent non-pass call was a double.
         */
        const lastNonPassCall =
            this.lastNonPassCall();

        if (
            !lastNonPassCall ||
            !lastNonPassCall.bid
                .isDouble()
        ) {
            return false;
        }

        /*
         * The player redoubling must be on the
         * partnership that owns the contract.
         */
        return (
            partnershipOf(
                this.currentSeat
            ) ===
            partnershipOf(
                contractCall.seat
            )
        );
    }

    legalContractBids():
        Bid[] {
        const legalBids:
            Bid[] = [];

        for (
            let level = 1;
            level <= 7;
            level++
        ) {
            for (
                const suit of
                BID_SUITS
            ) {
                const bid =
                    Bid.Contract(
                        level,
                        suit
                    );

                if (
                    this.isLegalBid(
                        bid
                    )
                ) {
                    legalBids.push(
                        bid
                    );
                }
            }
        }

        return legalBids;
    }

    lastContract():
        Bid | undefined {
        const call =
            this.lastContractCall();

        return call?.bid;
    }

    lastContractCall():
        AuctionCall | undefined {
        for (
            let index =
                this.calls.length - 1;
            index >= 0;
            index--
        ) {
            const call =
                this.calls[index];

            if (
                call.bid.isContract()
            ) {
                return call;
            }
        }

        return undefined;
    }

    isPassedOut(): boolean {
        return (
            this.calls.length === 4 &&
            this.calls.every(
                call =>
                    call.bid.isPass()
            )
        );
    }

    isComplete(): boolean {
        if (this.isPassedOut()) {
            return true;
        }

        /*
         * An auction cannot end until at least
         * one contract bid has been made.
         */
        if (!this.lastContractCall()) {
            return false;
        }

        if (this.calls.length < 4) {
            return false;
        }

        /*
         * After a contract, double, or redouble,
         * three consecutive passes end the auction.
         */
        return this.calls
            .slice(-3)
            .every(
                call =>
                    call.bid.isPass()
            );
    }

    finalContract():
        Contract | undefined {
        if (
            !this.isComplete() ||
            this.isPassedOut()
        ) {
            return undefined;
        }

        const finalContractCall =
            this.lastContractCall();

        if (
            !finalContractCall ||
            finalContractCall.bid
                .level === undefined ||
            finalContractCall.bid
                .suit === undefined
        ) {
            return undefined;
        }

        const declarer =
            this.determineDeclarer(
                finalContractCall
            );

        return new Contract(
            finalContractCall
                .bid
                .level,
            finalContractCall
                .bid
                .suit,
            declarer,
            this.contractMultiplier()
        );
    }

    private determineDeclarer(
        finalContractCall:
            AuctionCall
    ): Seat {
        const finalSuit =
            finalContractCall
                .bid
                .suit;

        if (
            finalSuit === undefined
        ) {
            return (
                finalContractCall.seat
            );
        }

        const declaringPartnership =
            partnershipOf(
                finalContractCall.seat
            );

        /*
         * Declarer is the first player from the
         * declaring partnership who bid the final
         * contract strain.
         */
        const firstMatchingCall =
            this.calls.find(
                call =>
                    call.bid
                        .isContract() &&
                    call.bid.suit ===
                        finalSuit &&
                    partnershipOf(
                        call.seat
                    ) ===
                        declaringPartnership
            );

        return (
            firstMatchingCall?.seat ??
            finalContractCall.seat
        );
    }

    private lastNonPassCall():
        AuctionCall | undefined {
        for (
            let index =
                this.calls.length - 1;
            index >= 0;
            index--
        ) {
            const call =
                this.calls[index];

            if (
                !call.bid.isPass()
            ) {
                return call;
            }
        }

        return undefined;
    }

    private contractMultiplier():
        ContractMultiplier {
        const contractIndex =
            this.lastContractIndex();

        if (contractIndex < 0) {
            return (
                ContractMultiplier
                    .Undoubled
            );
        }

        /*
         * Only calls after the final contract bid
         * affect that contract's multiplier.
         *
         * A later contract bid therefore cancels
         * any earlier double or redouble.
         */
        const callsAfterContract =
            this.calls.slice(
                contractIndex + 1
            );

        const wasRedoubled =
            callsAfterContract.some(
                call =>
                    call.bid
                        .isRedouble()
            );

        if (wasRedoubled) {
            return (
                ContractMultiplier
                    .Redoubled
            );
        }

        const wasDoubled =
            callsAfterContract.some(
                call =>
                    call.bid
                        .isDouble()
            );

        if (wasDoubled) {
            return (
                ContractMultiplier
                    .Doubled
            );
        }

        return (
            ContractMultiplier
                .Undoubled
        );
    }

    private lastContractIndex():
        number {
        for (
            let index =
                this.calls.length - 1;
            index >= 0;
            index--
        ) {
            if (
                this.calls[index]
                    .bid
                    .isContract()
            ) {
                return index;
            }
        }

        return -1;
    }

    private bidValue(
        bid: Bid
    ): number {
        if (
            !bid.isContract() ||
            bid.level === undefined ||
            bid.suit === undefined
        ) {
            return -1;
        }

        return (
            bid.level * 5 +
            BID_SUIT_ORDER[
                bid.suit
            ]
        );
    }
}