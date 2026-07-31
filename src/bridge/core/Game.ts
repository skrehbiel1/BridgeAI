import { Hand } from "../cards/Hand";
import { Card } from "../cards/Card";

import {
    Seat,
    nextSeat,
} from "./Seat";

import {
    Deal,
    DealResult,
} from "./Deal";

import {
    Table,
} from "./Table";

import {
    Contract,
} from "../play/Contract";

import {
    PlayedCard,
} from "../play/PlayedCard";

import {
    PlayValidator,
} from "../play/PlayValidator";

import {
    TrickWinner,
} from "../play/TrickWinner";

import {
    partnershipOf,
} from "./Partnership";

import {
    PlayerController,
} from "./PlayerController";

import {
    DeclarerAI,
} from "../ai/DeclarerAI";

import {
    DefenseAI,
} from "../ai/DefenseAI";



export class Game {


    hands: DealResult;


    table: Table;


    currentSeat: Seat;


    controllers:
        Record<Seat, PlayerController>;



    constructor(

        public contract: Contract,

        openingLeader: Seat

    ) {


        this.hands =
            Deal.create();



        this.table =
            new Table();



        this.currentSeat =
            openingLeader;



        this.controllers = {


            [Seat.North]:

                new PlayerController(

                    Seat.North,

                    new DeclarerAI()

                ),



            [Seat.East]:

                new PlayerController(

                    Seat.East,

                    new DefenseAI()

                ),



            [Seat.South]:

                new PlayerController(

                    Seat.South

                ),



            [Seat.West]:

                new PlayerController(

                    Seat.West,

                    new DefenseAI()

                )

        };


    }




    handOf(
        seat: Seat
    ): Hand {

        return this.hands[seat];

    }




    playCard(

        seat: Seat,

        card: Card

    ): boolean {



        if(

            seat !== this.currentSeat

        ) {

            return false;

        }




        const hand =
            this.handOf(seat);




        const legal =

            PlayValidator.isLegalPlay(

                hand,

                card,

                this.table
                    .currentTrick
                    .leadSuit

            );




        if(!legal){

            return false;

        }




        hand.remove(card);




        const played: PlayedCard = {


            seat,

            card


        };




        this.table.currentTrick

            .addCard(

                played

            );





        if(

            this.table.currentTrick

                .isComplete()

        ) {


            this.finishTrick();



        } else {



            this.currentSeat =

                nextSeat(

                    this.currentSeat

                );

        }




        return true;


    }





playComputerTurn(): boolean {

    const seat = this.currentSeat;

    const controller =
        this.controllers[seat];

    if (!controller.isComputer()) {
        return false;
    }

    const hand =
        this.handOf(seat);

    if (hand.cards.length === 0) {
        return false;
    }

    const leadSuit =
        this.table.currentTrick.leadSuit;

    /*
     * Ask the AI for its preferred card.
     */
    const aiCard =
        controller.ai?.chooseCard(
            seat,
            hand,
            this.table.currentTrick
        );

    /*
     * Use the AI card only if it is legal.
     */
    if (
        aiCard &&
        PlayValidator.isLegalPlay(
            hand,
            aiCard,
            leadSuit
        )
    ) {
        return this.playCard(
            seat,
            aiCard
        );
    }

    /*
     * Fallback: find any legal card.
     * This prevents the game from freezing
     * when an AI returns an invalid choice.
     */
const fallbackCard =
    hand.cards.find(card =>
        PlayValidator.isLegalPlay(
            hand,
            card,
            leadSuit
        )
    );

if (!fallbackCard) {
    return false;
}

return this.playCard(
    seat,
    fallbackCard
);
}






    playAllComputerTurns(){



        while(

            this.currentSeat !== Seat.South

            &&

            !this.isFinished()

        ){


            this.playComputerTurn();


        }


    }






    private finishTrick(){



        const winner =

            TrickWinner.determine(

                this.table

                    .currentTrick

                    .cards,

                this.contract.trump

            );





        this.table.awardTrick(

            partnershipOf(

                winner

            )

        );





        this.table.currentTrick

            .clear();





        this.currentSeat =

            winner;


    }






    isFinished(): boolean {



        return (

            this.table.totalTricks()

            ===

            13

        );


    }






    tricksWon(){

        return {

            NS:

                this.table.nsTricks,


            EW:

                this.table.ewTricks

        };

    }



}