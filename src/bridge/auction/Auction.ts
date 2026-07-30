import { Bid } from "./Bid";


export class Auction {


    bids:Bid[]=[];



    addBid(
        bid:Bid
    ){

        this.bids.push(
            bid
        );

    }



    lastContract():

        Bid | undefined {


        const contracts =
            this.bids.filter(

                b =>
                !b.isPass()

            );


        if(
            contracts.length===0
        ){

            return undefined;

        }


        return contracts[
            contracts.length-1
        ];

    }



    isComplete(){

        if(
            this.bids.length < 4
        ){

            return false;

        }


        const lastThree =
            this.bids.slice(-3);


        return lastThree.every(

            b =>
            b.isPass()

        );

    }


}