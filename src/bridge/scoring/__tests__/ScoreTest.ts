import { Suit } from "../../cards/Card";

import {
    Vulnerability
}
from "../RubberScore";

import {
    Contract
}
from "../../play/Contract";


import {
    Seat
}
from "../../core/Seat";


import {
    DuplicateScore
}
from "../DuplicateScore";



const result =
DuplicateScore.calculate(

new Contract(

4,

Suit.Spades,

Seat.South

),

10,

Vulnerability.None

);



console.log(result);