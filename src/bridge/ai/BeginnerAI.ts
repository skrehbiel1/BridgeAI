import { BridgeAI } from "./BridgeAI";
import { Card } from "../cards/Card";
import { Hand } from "../cards/Hand";
import { Trick } from "../play/Trick";
import { Seat } from "../core/Seat";


export class BeginnerAI
implements BridgeAI {


chooseCard(
    seat: Seat,
    hand: Hand,
    trick: Trick
): Card {


    const leadSuit =
        trick.leadSuit;


    if(leadSuit){


        const following =
            hand.cardsOfSuit(
                leadSuit
            );


        if(
            following.length > 0
        ){

            return following[
                0
            ];

        }

    }


    return hand.cards[0];

}


}