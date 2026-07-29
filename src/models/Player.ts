import {
    Hand
}
from "./Hand";



export class Player {


    hand:Hand;


    constructor(

        public name:string

    ){

        this.hand =
            new Hand();

    }


}