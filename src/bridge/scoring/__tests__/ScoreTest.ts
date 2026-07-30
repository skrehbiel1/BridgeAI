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

"♠",

Seat.South

),

10,

"None"

);



console.log(result);