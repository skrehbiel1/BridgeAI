import {
    BridgeHand
}
from "./BridgeHand";


import {
    GamePhase
}
from "./GamePhase";



export class BridgeMatch {


    currentHand:
        BridgeHand;



    constructor(){


        this.currentHand =
            new BridgeHand();

    }



    start(){

        this.currentHand
            .startAuction();

    }



    isPlaying(){

        return (

            this.currentHand.phase ===
            GamePhase.PLAY

        );

    }


}