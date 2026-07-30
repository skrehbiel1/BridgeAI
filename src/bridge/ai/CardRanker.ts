import { Card } from "../cards/Card";


export class CardRanker {


    static value(card: Card): number {


        switch(card.rank){


            case 14:
                return 100;


            case 13:
                return 80;


            case 12:
                return 60;


            case 11:
                return 40;


            default:
                return card.rank;

        }

    }



    static lowest(cards:Card[]):Card {

        return cards.reduce(

            (low,current)=>

            this.value(current)
            <
            this.value(low)

            ?
            current
            :
            low

        );

    }



    static highest(cards:Card[]):Card {

        return cards.reduce(

            (high,current)=>

            this.value(current)
            >
            this.value(high)

            ?
            current
            :
            high

        );

    }


}