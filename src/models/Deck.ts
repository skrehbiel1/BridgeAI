import {
    Card,
    Suit,
    Rank
}
from "./Card";


import {
    shuffle
}
from "../utils/shuffle";



export class Deck {


    cards:Card[]=[];


    constructor(){


        for(
            const suit of Object.values(Suit)
        ){

            for(
                const rank of Object.values(Rank)
            ){

                this.cards.push(

                    new Card(
                        suit,
                        rank
                    )

                );

            }

        }


    }



    shuffle(){

        shuffle(this.cards);

    }



    deal():Card{


        const card =
            this.cards.pop();


        if(!card){

            throw new Error(
                "No cards remaining"
            );

        }


        return card;

    }


}