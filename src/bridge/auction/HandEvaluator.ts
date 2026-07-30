import { Hand } from "../cards/Hand";
import { Rank } from "../cards/Card";
import { Suit } from "../cards/Card";

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
            hand.cardsOfSuit(Suit.Clubs).length,

            D:
            hand.cardsOfSuit(Suit.Diamonds).length,

            H:
            hand.cardsOfSuit(Suit.Hearts).length,

            S:
            hand.cardsOfSuit(Suit.Spades).length

        };

    }


}