import { Hand } from "../cards/Hand";
import { Auction } from "./Auction";
import { Bid } from "./Bid";

export interface BidStrategy {
    chooseBid(
        hand: Hand,
        auction: Auction
    ): Bid;
}