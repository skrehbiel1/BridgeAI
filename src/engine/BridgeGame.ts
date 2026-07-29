import {
    Deck
}
from "../models/Deck";


import {
    Player
}
from "../models/Player";



export class BridgeGame {


    deck:Deck;


    north:Player;

    east:Player;

    south:Player;

    west:Player;



    constructor(){


        this.deck =
            new Deck();


        this.north =
            new Player("North");


        this.east =
            new Player("East");


        this.south =
            new Player("South");


        this.west =
            new Player("West");


    }



    deal(){


        this.deck.shuffle();



        for(
            let i=0;
            i<13;
            i++
        ){


            this.north.hand.add(
                this.deck.deal()
            );


            this.east.hand.add(
                this.deck.deal()
            );


            this.south.hand.add(
                this.deck.deal()
            );


            this.west.hand.add(
                this.deck.deal()
            );


        }



        this.north.hand.sort();

        this.east.hand.sort();

        this.south.hand.sort();

        this.west.hand.sort();


    }


}