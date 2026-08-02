import { Hand } from "../cards/Hand";

import { Auction } from "./Auction";
import { Bid } from "./Bid";

import {
    StandardAmericanBidStrategy
} from "./StandardAmericanBidStrategy";

export class BiddingAI {
    private static readonly strategy =
        new StandardAmericanBidStrategy();

    static chooseBid(
        hand: Hand,
        auction: Auction
    ): Bid {
        return this.strategy.chooseBid(
            hand,
            auction
        );
    }
}