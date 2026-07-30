import { Card } from "../cards/Card";
import { Hand } from "../cards/Hand";
import { Trick } from "../play/Trick";
import { Seat } from "../core/Seat";


export interface BridgeAI {

    chooseCard(
        seat: Seat,
        hand: Hand,
        trick: Trick
    ): Card;

}