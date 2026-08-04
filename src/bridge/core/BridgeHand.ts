import { Deal, DealResult } 
from "./Deal";

import {
    Auction
}
from "../auction/Auction";

import {
    Bid
}
from "../auction/Bid";

import {
    GamePhase
}
from "./GamePhase";

import {
    Contract
}
from "../play/Contract";

import {
    Seat
}
from "./Seat";



export class BridgeHand {


    hands:DealResult;


    auction:
        Auction;


    contract?:
        Contract;


    phase:
        GamePhase;



    constructor(){


        this.hands =
            Deal.create();


        this.auction =
            new Auction(
    	    Seat.North
	    );


        this.phase =
            GamePhase.DEALING;


    }





    startAuction(){

        this.phase =
            GamePhase.AUCTION;

    }




    addBid(
        bid:Bid
    ){

        this.auction.addBid(
            bid
        );


        if(
            this.auction.isComplete()
        ){

            this.createContract();

        }

    }





private createContract(): void {
    const contract =
        this.auction.finalContract();

    if (!contract) {
        this.phase =
            GamePhase.COMPLETE;

        return;
    }

    this.contract =
        contract;

    this.phase =
        GamePhase.PLAY;
}


}