import { Suit } from "../cards/Card";

import {
    Seat,
    nextSeat
} from "../core/Seat";

import {
    partnershipOf
} from "../core/Partnership";

import {
    Contract
} from "../play/Contract";

import {
    AuctionCall
} from "./AuctionCall";

import {
    Bid,
    BidSuit
} from "./Bid";

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
    public dealer: Seat = Seat.North
) {
    this.currentSeat =
        dealer;
}

    /*
     * Compatibility helper for existing code
     * that expects auction.bids.
     */
    get bids(): Bid[] {
        return this.calls.map(
            call => call.bid
        );
    }

    addBid(
        bid: Bid
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
                bid
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

    legalContractBids(): Bid[] {
        const bids: Bid[] = [];

        const suits: BidSuit[] = [
            Suit.Clubs,
            Suit.Diamonds,
            Suit.Hearts,
            Suit.Spades,
            "NT"
        ];

        for (
            let level = 1;
            level <= 7;
            level++
        ) {
            for (const suit of suits) {
                const bid =
                    new Bid(
                        level,
                        suit
                    );

                if (
                    this.isLegalBid(bid)
                ) {
                    bids.push(bid);
                }
            }
        }

        return bids;
    }

    lastContract():
        Bid | undefined {
        for (
            let index =
                this.calls.length - 1;
            index >= 0;
            index--
        ) {
            const bid =
                this.calls[index].bid;

            if (!bid.isPass()) {
                return bid;
            }
        }

        return undefined;
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

            if (!call.bid.isPass()) {
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

        if (!this.lastContract()) {
            return false;
        }

        if (this.calls.length < 4) {
            return false;
        }

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

        const finalCall =
            this.lastContractCall();

        if (!finalCall) {
            return undefined;
        }

        const declarer =
            this.determineDeclarer(
                finalCall
            );

        return new Contract(
            finalCall.bid.level,
            finalCall.bid.suit,
            declarer
        );
    }

    private determineDeclarer(
        finalCall: AuctionCall
    ): Seat {
        const finalPartnership =
            partnershipOf(
                finalCall.seat
            );

        const finalSuit =
            finalCall.bid.suit;

        const firstMatchingCall =
            this.calls.find(
                call =>
                    !call.bid.isPass() &&
                    call.bid.suit ===
                        finalSuit &&
                    partnershipOf(
                        call.seat
                    ) ===
                        finalPartnership
            );

        return (
            firstMatchingCall?.seat ??
            finalCall.seat
        );
    }

    private bidValue(
        bid: Bid
    ): number {
        return (
            bid.level * 5 +
            BID_SUIT_ORDER[
                bid.suit
            ]
        );
    }
}