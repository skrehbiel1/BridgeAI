import { BridgeAI } from "./BridgeAI";

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

import {
    TrickPlayEvaluator
} from "./TrickPlayEvaluator";

export class BeginnerAI
implements BridgeAI {
    chooseDecision(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): PlayDecision {
        /*
         * BeginnerAI uses the same simple defensive
         * evaluator and explanation pipeline.
         */
        return TrickPlayEvaluator
            .chooseDefensiveDecision(
                seat,
                hand,
                trick,
                trump
            );
    }

    chooseCard(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): Card {
        return this.chooseDecision(
            seat,
            hand,
            trick,
            trump
        ).card;
    }
}