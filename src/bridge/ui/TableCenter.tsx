import React from "react";

import {
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    Card,
    Suit
} from "../cards/Card";

import AnimatedPlayedCard from "./AnimatedPlayedCard";

import { Seat } from "../core/Seat";
import { Trick } from "../play/Trick";
import { suitSymbol } from "../cards/SuitDisplay";

interface Props {
    trick: Trick;
}

interface PlayedCardProps {
    card: Card;
}

function displayRank(
    rank: number
): string {
    switch (rank) {
        case 14:
            return "A";

        case 13:
            return "K";

        case 12:
            return "Q";

        case 11:
            return "J";

        default:
            return String(rank);
    }
}

function suitColor(
    suit: Suit
): string {
    if (
        suit === Suit.Hearts ||
        suit === Suit.Diamonds
    ) {
        return "#C62828";
    }

    return "#111111";
}


export default function TableCenter({
    trick
}: Props) {
    const cardAt = (
        seat: Seat
    ) =>
        trick.cards.find(
            played =>
                played.seat === seat
        );

    const north =
        cardAt(Seat.North);

    const east =
        cardAt(Seat.East);

    const south =
        cardAt(Seat.South);

    const west =
        cardAt(Seat.West);

    return (
        <View style={styles.table}>
            <Text style={styles.label}>
                Current Trick
            </Text>

            <View style={styles.northPosition}>
                {north && (
                    <AnimatedPlayedCard
        		card={north.card}
      		  	seat={Seat.North}
    		     />
                )}
            </View>

            <View style={styles.westPosition}>
                {west && (
                    <AnimatedPlayedCard
        		card={west.card}
      		  	seat={Seat.West}
    		     />
                )}
            </View>

            <View style={styles.eastPosition}>
                {east && (
                    <AnimatedPlayedCard
        		card={east.card}
      		  	seat={Seat.East}
    		     />
                )}
            </View>

            <View style={styles.southPosition}>
                {south && (
                    <AnimatedPlayedCard
        		card={south.card}
      		  	seat={Seat.South}
    		     />
                )}
            </View>
        </View>
    );
}

const CARD_WIDTH = 48;
const CARD_HEIGHT = 58;

const styles = StyleSheet.create({
    table: {
        width: 210,
        height: 210,
        borderRadius: 105,
        position: "relative",
        backgroundColor: "#08752F",
        borderWidth: 3,
        borderColor: "#075324"
    },

    label: {
        position: "absolute",
        top: 95,
        alignSelf: "center",
        color: "rgba(255,255,255,0.5)",
        fontSize: 11,
        fontWeight: "600",
        includeFontPadding: false
    },

    playedCard: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#333333",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000000",
        shadowOpacity: 0.25,
        shadowRadius: 3,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },

    cardText: {
        fontSize: 18,
        fontWeight: "700",
        lineHeight: 23,
        includeFontPadding: false
    },

    northPosition: {
        position: "absolute",
        top: 13,
        left: 78,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },

    southPosition: {
        position: "absolute",
        bottom: 13,
        left: 78,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },

    westPosition: {
        position: "absolute",
        top: 74,
        left: 17,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },

    eastPosition: {
        position: "absolute",
        top: 74,
        right: 17,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    }
});