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

export class DefenseAI
implements BridgeAI {
    chooseDecision(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): PlayDecision {
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