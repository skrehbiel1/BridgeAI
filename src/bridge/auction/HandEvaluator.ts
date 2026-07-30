import { Hand } from "../cards/Hand";
import { Rank } from "../cards/Card";


export class HandEvaluator {


    static highCardPoints(
        hand:Hand
    ):number {


        let points=0;


        for(
            const card of hand.cards
        ){

            switch(card.rank){

                case Rank.Ace:
                    points += 4;
                    break;

                case Rank.King:
                    points += 3;
                    break;

                case Rank.Queen:
                    points += 2;
                    break;

                case Rank.Jack:
                    points += 1;
                    break;

            }

        }


        return points;

    }



    static suitLengths(
        hand:Hand
    ){

        return {

            C:
            hand.cardsOfSuit("C").length,

            D:
            hand.cardsOfSuit("D").length,

            H:
            hand.cardsOfSuit("H").length,

            S:
            hand.cardsOfSuit("S").length

        };

    }


}