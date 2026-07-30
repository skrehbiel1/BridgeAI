import { Hand } from "../cards/Hand";
import { Card } from "../cards/Card";


export class OpeningLeadAI {


static chooseLead(
    hand:Hand
):Card {


let longest =
    hand.cards[0];



for(
const card of hand.cards
){

    const count =
        hand.cardsOfSuit(
            card.suit
        ).length;


    const current =
        hand.cardsOfSuit(
            longest.suit
        ).length;


    if(count > current){

        longest = card;

    }

}



const suitCards =
    hand.cardsOfSuit(
        longest.suit
    );



return suitCards[

    Math.max(
        0,
        suitCards.length-4
    )

];


}


}