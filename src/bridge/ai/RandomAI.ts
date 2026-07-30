import { BridgeAI } from "./BridgeAI";
import { Card } from "../cards/Card";
import { Hand } from "../cards/Hand";
import { Trick } from "../play/Trick";
import { Seat } from "../core/Seat";


export class RandomAI
implements BridgeAI {


    chooseCard(
        seat: Seat,
        hand: Hand,
        trick: Trick
    ): Card {


        if(hand.cards.length === 0){

            throw new Error(
                "No cards available"
            );

        }


        return hand.cards[
            Math.floor(
                Math.random()
                *
                hand.cards.length
            )
        ];

    }

}