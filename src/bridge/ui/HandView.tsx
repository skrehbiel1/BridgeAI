import React from "react";

import {
    View,
    StyleSheet
}
from "react-native";

import {
    Hand
}
from "../cards/Hand";

import CardView from "./CardView";


interface Props {

    hand: Hand;

    onCardPlayed:
        (index:number)=>void;

}



export default function HandView({

    hand,

    onCardPlayed

}:Props){


return (

<View style={styles.container}>


{
hand.cards.map(

(card,index)=>(

<CardView

key={index}

card={card}

onPress={()=>
    onCardPlayed(index)
}

/>

)

)

}


</View>


);


}



const styles =
StyleSheet.create({

container:{

    flexDirection:"row",

    flexWrap:"wrap",

    justifyContent:"center"

}

});