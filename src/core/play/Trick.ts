import {
    Card,
    Suit
}
from "../../models/Card";


import {
    rankValue
}
from "../cards/CardUtils";


import {
    Trump
}
from "../../types/bridge";



export interface PlayedCard {


    player:string;

    card:Card;


}



export class Trick {


cards:PlayedCard[]=[];


leadSuit?:Suit;



play(
player:string,
card:Card
){


    if(this.cards.length===0){

        this.leadSuit =
            card.suit;

    }


    this.cards.push({

        player,
        card

    });


}



complete(){

    return this.cards.length===4;

}



winner(
trump:Trump
):string {


let winning =
    this.cards[0];



for(
const played of this.cards.slice(1)
){


if(
this.beats(
played.card,
winning.card,
trump
)
){

winning=played;

}


}


return winning.player;


}



private beats(

candidate:Card,

current:Card,

trump:Trump

){



if(
candidate.suit===current.suit
){

return (

rankValue(candidate.rank)
>
rankValue(current.rank)

);

}



if(
candidate.suit===trump
){

return true;

}



return false;


}


}