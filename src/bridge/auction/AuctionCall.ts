import { Seat } from "../core/Seat";
import { Bid } from "./Bid";

export class AuctionCall {
    constructor(
        public seat: Seat,
        public bid: Bid
    ) {}
}