import {
    Card
}
from "./Card";



export class Hand {


    cards:Card[]=[];



    add(card:Card){

        this.cards.push(card);

    }



    sort(){


        this.cards.sort(

            (a,b)=>

            a.suit.localeCompare(
                b.suit
            )

        );


    }


}