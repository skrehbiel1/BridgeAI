import { Hand } from "../cards/Hand";

import {
    HandEvaluator
}
from "./HandEvaluator";

import {
    Bid
}
from "./Bid";

import {
    Suit
}
from "../cards/Card";



export class OpeningBidAI {



static openingBid(
    hand:Hand
):Bid {


const points =
    HandEvaluator.highCardPoints(
        hand
    );


if(points < 13){

    return Bid.Pass();

}



const lengths =
    HandEvaluator.suitLengths(
        hand
    );



if(lengths.S >=5){

    return new Bid(
        1,
        Suit.Spades
    );

}



if(lengths.H >=5){

    return new Bid(
        1,
        Suit.Hearts
    );

}



if(lengths.D >= lengths.C){

    return new Bid(
        1,
        Suit.Diamonds
    );

}


return new Bid(
    1,
    Suit.Clubs
);


}


}