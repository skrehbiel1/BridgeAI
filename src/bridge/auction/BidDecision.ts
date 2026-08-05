import { Bid } from "./Bid";
import { BidExplanation } from "./BidExplanation";

export interface BidDecision {
    bid: Bid;
    explanation: BidExplanation;
}