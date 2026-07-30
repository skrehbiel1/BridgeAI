import React, {
    useState
}
from "react";


import {
    View,
    Text,
    Button
}
from "react-native";


import {
    Game
}
from "../core/Game";


import {
    Contract
}
from "../play/Contract";


import {
    Seat
}
from "../core/Seat";


import HandView from "./HandView";

import TrickView from "./TrickView";



export default function BridgeTable(){


const [
    game
] = useState(

new Game(

new Contract(

4,

"♠",

Seat.South

),

Seat.West

)

);



const [
    update,
    setUpdate
] = useState(0);



function playSouthCard(
    index:number
){


const card =
    game.handOf(
        Seat.South
    ).cards[index];



game.playCard(

    Seat.South,

    card

);



while(

game.currentSeat !== Seat.South

&&

!game.isFinished()

){

    game.playComputerTurn();

}



setUpdate(
    update+1
);


}



return (

<View>


<Text>

BridgeAI

</Text>


<Text>

Turn:
{
game.currentSeat
}

</Text>



<TrickView

trick={
game.table.currentTrick
}

/>



<HandView

hand={
game.handOf(
    Seat.South
)
}

onCardPlayed={
playSouthCard
}

/>


</View>

);


}