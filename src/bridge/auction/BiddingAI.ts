import { Hand } from "../cards/Hand";

import { Auction } from "./Auction";
import { Bid } from "./Bid";

import {
    BidDecision
} from "./BidDecision";

import {
    BidExplainer
} from "./BidExplainer";

import {
    StandardAmericanBidStrategy
} from "./StandardAmericanBidStrategy";

export class BiddingAI {
    private static readonly strategy =
        new StandardAmericanBidStrategy();

    static chooseDecision(
        hand: Hand,
        auction: Auction
    ): BidDecision {
        const bid =
            this.strategy.chooseBid(
                hand,
                auction
            );

        return {
            bid,

            explanation:
                BidExplainer.explain(
                    hand,
                    auction,
                    bid
                )
        };
    }

    /*
     * Compatibility method for older callers.
     */
    static chooseBid(
        hand: Hand,
        auction: Auction
    ): Bid {
        return this.chooseDecision(
            hand,
            auction
        ).bid;
    }
}