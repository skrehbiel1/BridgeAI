import { Seat } from "../core/Seat";
import { Bid } from "./Bid";

import {
    BidExplanation
} from "./BidExplanation";

export class AuctionCall {
    constructor(
        public seat: Seat,
        public bid: Bid,
        public explanation?:
            BidExplanation
    ) {}
}