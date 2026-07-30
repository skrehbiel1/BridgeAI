import {
    Contract
}
from "../play/Contract";


import {
    Vulnerability
}
from "./RubberScore";


import {
    ScoreResult
}
from "./ScoreResult";



export class DuplicateScore {



static calculate(

    contract: Contract,

    tricksWon:number,

    vulnerability:Vulnerability

):ScoreResult {



const required =
    contract.requiredTricks();



const made =
    tricksWon >= required;



let contractPoints = 0;

let bonusPoints = 0;

let penaltyPoints = 0;



if(made){


contractPoints =
    this.trickPoints(
        contract,
        tricksWon
    );



bonusPoints =
    this.bonus(
        contract,
        vulnerability
    );


}

else {


const down =
    required -
    tricksWon;



penaltyPoints =
    this.penalty(
        down,
        vulnerability
    );


}



return {


made,

contractPoints,

bonusPoints,

penaltyPoints,

total:

    contractPoints
    +
    bonusPoints
    -
    penaltyPoints


};


}





private static trickPoints(

contract:Contract,

tricksWon:number

){


const level =
    contract.level;



switch(contract.trump){


case "♣":

case "♦":

return level * 20;



case "♥":

case "♠":

return level * 30;



case "NT":

return 40 +
       (level-1)*30;



}



}





private static bonus(

contract:Contract,

vulnerability:Vulnerability

){


if(contract.level===6){

return vulnerability ===
"None"
? 500
: 750;

}



if(contract.level===7){

return vulnerability ===
"None"
? 1000
: 1500;

}



return 50;

}





private static penalty(

down:number,

vulnerability:Vulnerability

){


return (

vulnerability==="None"
?
50
:
100

)
*
down;


}



}