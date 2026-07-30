import { Suit } from "../cards/Card";


export type BidSuit =
    | Suit
    | "NT";


export class Bid {


    constructor(

        public level:number,

        public suit:BidSuit,

        public pass:boolean=false

    ){}



    static Pass(){

        return new Bid(
            0,
            "NT",
            true
        );

    }



    isPass(){

        return this.pass;

    }



    toString(){

        if(this.pass){

            return "Pass";

        }


        return `${this.level}${this.suit}`;

    }


}