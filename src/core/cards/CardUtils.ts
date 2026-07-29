import {
    Card,
    Rank,
    Suit
}
from "../../models/Card";



export function rankValue(
    rank:Rank
):number {


    switch(rank){

        case Rank.Ace:
            return 14;

        case Rank.King:
            return 13;

        case Rank.Queen:
            return 12;

        case Rank.Jack:
            return 11;

        case Rank.Ten:
            return 10;

        default:
            return Number(rank);

    }

}



export function sameCard(
a:Card,
b:Card
){

    return (

        a.rank === b.rank
        &&
        a.suit === b.suit

    );

}



export function suitSymbol(
suit:Suit
){

    return suit;

}