import { Card } from "../cards/Card";
import { Hand } from "../cards/Hand";

import { Seat } from "../core/Seat";

import {
    TrumpSuit
} from "../play/Contract";

import { Trick } from "../play/Trick";

import {
    PlayDecision
} from "./PlayDecision";

export interface BridgeAI {
    chooseDecision(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): PlayDecision;

    /*
     * Compatibility method used by the existing
     * Game class.
     */
    chooseCard(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): Card;
}