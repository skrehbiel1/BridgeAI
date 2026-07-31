import React from "react";

import {
    TouchableOpacity,
    Text,
    StyleSheet
}
from "react-native";

import { Card, Suit }
from "../cards/Card";

import { suitSymbol }
from "../cards/SuitDisplay";


interface Props {

    card: Card;

    onPress?: () => void;

}


function displayRank(
    rank: number
): string {

    switch(rank){

        case 14:
            return "A";

        case 13:
            return "K";

        case 12:
            return "Q";

        case 11:
            return "J";

        default:
            return rank.toString();

    }

}


function suitColor(
    suit: Suit
): string {

    switch(suit){

        case Suit.Hearts:
        case Suit.Diamonds:
            return "red";

        default:
            return "black";

    }

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

            <Text
                style={[
                    styles.text,
                    {
                        color:
                        suitColor(
                            card.suit
                        )
                    }
                ]}
            >
                {
		`${displayRank(card.rank)}${suitSymbol(card.suit)}`
                }
            </Text>

        </TouchableOpacity>

    );

}


const styles =
StyleSheet.create({

card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    margin: 4,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center"
},

    text: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 22,
    textAlignVertical: "center",
    includeFontPadding: false
    }
});