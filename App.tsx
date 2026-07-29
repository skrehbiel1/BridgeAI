import React from "react";

import {
    SafeAreaView,
    ScrollView,
    Text,
    StyleSheet
}
from "react-native";


import {
    BridgeGame
}
from "./src/engine/BridgeGame";



export default function App(){


    const game =
        new BridgeGame();


    game.deal();



    return (

        <SafeAreaView
            style={styles.container}
        >


            <Text
                style={styles.title}
            >
                BridgeAI
            </Text>



            <Text>
                South Hand
            </Text>



            <ScrollView>


            {
                game.south.hand.cards.map(

                    (card,index)=>(

                        <Text
                            key={index}
                            style={styles.card}
                        >

                            {card.toString()}

                        </Text>

                    )

                )

            }


            </ScrollView>


        </SafeAreaView>

    );

}



const styles =
StyleSheet.create({


container:{

    flex:1,

    padding:30

},


title:{

    fontSize:30,

    fontWeight:"bold",

    marginBottom:20

},


card:{

    fontSize:24,

    margin:5

}


});