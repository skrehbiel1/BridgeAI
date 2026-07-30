export enum Vulnerability {

    None="None",

    NS="NS",

    EW="EW",

    Both="Both"

}



export class RubberScore {


    ns = 0;

    ew = 0;



    addNS(points:number){

        this.ns += points;

    }



    addEW(points:number){

        this.ew += points;

    }



    winner(){

        if(this.ns > this.ew){

            return "NS";

        }


        if(this.ew > this.ns){

            return "EW";

        }


        return "Tie";

    }


}