import { BridgeAI } from "./BridgeAI";

import { Card } from "../cards/Card";

import { Hand } from "../cards/Hand";

import { Trick } from "../play/Trick";

import { Seat } from "../core/Seat";

import { CardRanker } from "./CardRanker";



export class DefenseAI
implements BridgeAI {



chooseCard(

seat:Seat,

hand:Hand,

trick:Trick

):Card {


return CardRanker.lowest(
    hand.cards
);


}


}