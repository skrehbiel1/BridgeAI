import React from "react";

import {
    TouchableOpacity,
    Text,
    StyleSheet
}
from "react-native";

import {
    Card
}
from "../cards/Card";


interface Props {

    card: Card;

    onPress?: () => void;

}



export default function CardView({

    card,

    onPress

}: Props){


return (

<TouchableOpacity

    style={styles.card}

    onPress={onPress}

>

<Text style={styles.text}>

    {card.toString()}

</Text>


</TouchableOpacity>


);


}



const styles =
StyleSheet.create({

card:{

    backgroundColor:"#fff",

    borderWidth:1,

    borderRadius:8,

    padding:12,

    margin:4,

    width:55,

    alignItems:"center"

},


text:{

    fontSize:20

}


});