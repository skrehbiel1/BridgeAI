import { BridgeAI } from "./BridgeAI";
import { Card } from "../cards/Card";
import { Hand } from "../cards/Hand";
import { Trick } from "../play/Trick";
import { TrumpSuit } from "../play/Contract";
import { Seat } from "../core/Seat";
import { TrickPlayEvaluator } from "./TrickPlayEvaluator";

export class DefenseAI
implements BridgeAI {
    chooseCard(
        seat: Seat,
        hand: Hand,
        trick: Trick,
        trump: TrumpSuit
    ): Card {
        return TrickPlayEvaluator
            .chooseDefensiveCard(
                seat,
                hand,
                trick,
                trump
            );
    }
}