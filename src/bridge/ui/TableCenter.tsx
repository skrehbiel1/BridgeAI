import React from "react";

import {
    StyleSheet,
    Text,
    View
} from "react-native";

import { Card, Suit } from "../cards/Card";
import { Seat } from "../core/Seat";
import { Trick } from "../play/Trick";
import { suitSymbol } from "../cards/SuitDisplay";

interface Props {
    trick: Trick;
}

function displayRank(rank: number): string {
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
            return rank.toString();
    }
}

function suitColor(suit: Suit): string {
    if (
        suit === Suit.Hearts ||
        suit === Suit.Diamonds
    ) {
        return "#D00000";
    }

    return "#111111";
}

function PlayedCardView({
    card
}: {
    card: Card;
}) {
    return (
        <View style={styles.playedCard}>
            <Text
                style={[
                    styles.playedCardText,
                    {
                        color: suitColor(
                            card.suit
                        )
                    }
                ]}
            >
                {displayRank(card.rank)}
                {suitSymbol(card.suit)}
            </Text>
        </View>
    );
}

export default function TableCenter({
    trick
}: Props) {
    const north = trick.cards.find(
        played =>
            played.seat === Seat.North
    );

    const east = trick.cards.find(
        played =>
            played.seat === Seat.East
    );

    const south = trick.cards.find(
        played =>
            played.seat === Seat.South
    );

    const west = trick.cards.find(
        played =>
            played.seat === Seat.West
    );

    return (
        <View style={styles.table}>
            <Text style={styles.tableLabel}>
                Current Trick
            </Text>

            <View style={styles.northCard}>
                {north && (
                    <PlayedCardView
                        card={north.card}
                    />
                )}
            </View>

            <View style={styles.westCard}>
                {west && (
                    <PlayedCardView
                        card={west.card}
                    />
                )}
            </View>

            <View style={styles.eastCard}>
                {east && (
                    <PlayedCardView
                        card={east.card}
                    />
                )}
            </View>

            <View style={styles.southCard}>
                {south && (
                    <PlayedCardView
                        card={south.card}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    table: {
        width: 210,
        height: 210,
        borderRadius: 105,
        backgroundColor: "#08752F",
        borderWidth: 3,
        borderColor: "#075324",
        position: "relative"
    },

    tableLabel: {
        position: "absolute",
        alignSelf: "center",
        top: 94,
        color: "rgba(255,255,255,0.55)",
        fontSize: 11,
        fontWeight: "600"
    },

    playedCard: {
        width: 48,
        height: 58,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#333333",
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 4
    },

    playedCardText: {
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 23,
        includeFontPadding: false
    },

    northCard: {
        position: "absolute",
        top: 15,
        left: 81,
        width: 48,
        height: 58
    },

    southCard: {
        position: "absolute",
        bottom: 15,
        left: 81,
        width: 48,
        height: 58
    },

    westCard: {
        position: "absolute",
        top: 76,
        left: 18,
        width: 48,
        height: 58
    },

    eastCard: {
        position: "absolute",
        top: 76,
        right: 18,
        width: 48,
        height: 58
    }
});