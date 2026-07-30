import React from "react";

import {
    View,
    Text
}
from "react-native";

import {
    Trick
}
from "../play/Trick";


interface Props {

    trick: Trick;

}



export default function TrickView({

    trick

}:Props){


return (

<View>


<Text>

Current Trick

</Text>


{
trick.cards.map(

(played,index)=>(

<Text key={index}>

{
played.seat
}

:

{
played.card.toString()
}

</Text>

)

)

}


</View>


);


}