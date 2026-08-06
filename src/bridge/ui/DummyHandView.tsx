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

import { Hand } from "../cards/Hand";

import HandView from "./HandView";

interface Props {
    hand: Hand;
    leadSuit?: Suit;
    enabled: boolean;

    suggestedCard?: Card;

    onCardPlayed: (
        index: number
    ) => void;
}

export default function DummyHandView({
    hand,
    leadSuit,
    enabled,
    suggestedCard,
    onCardPlayed
}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <Text style={styles.title}>
                    North — Dummy
                </Text>

                <Text style={styles.cardCount}>
                    {hand.cards.length}{" "}
                    {hand.cards.length === 1
                        ? "card"
                        : "cards"}
                </Text>
            </View>

            <HandView
                hand={hand}
                leadSuit={leadSuit}
                enabled={enabled}
                suggestedCard={
                    suggestedCard
                }
                onCardPlayed={
                    onCardPlayed
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        maxWidth: 350,
        alignItems: "center"
    },

    heading: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
        paddingHorizontal: 4,
        marginBottom: 2
    },

    title: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
        includeFontPadding: false
    },

    cardCount: {
        color: "#E8F5E9",
        fontSize: 12,
        includeFontPadding: false
    }
});