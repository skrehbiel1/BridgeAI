import React from "react";

import {
    StyleSheet,
    Text,
    View
} from "react-native";

import { Hand } from "../cards/Hand";
import { Suit } from "../cards/Card";

import HandView from "./HandView";

interface Props {
    hand: Hand;
    leadSuit?: Suit;
    enabled: boolean;
    statusMessage: string;
    highlightStatus: boolean;

    title?: string;
    isDummy?: boolean;

    onCardPlayed: (
        index: number
    ) => void;
}

export default function SouthHandView({
    hand,
    leadSuit,
    enabled,
    statusMessage,
    highlightStatus,
    title = "South — You",
    isDummy = false,
    onCardPlayed
}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <Text style={styles.title}>
    			{title}
    			{isDummy ? " — Dummy" : ""}
		</Text>

                <Text style={styles.cardCount}>
                    {hand.cards.length}{" "}
                    {hand.cards.length === 1
                        ? "card"
                        : "cards"}
                </Text>
            </View>

            <Text
                style={[
                    styles.statusMessage,
                    highlightStatus &&
                        styles.highlightedStatus
                ]}
            >
                {statusMessage}
            </Text>

            <HandView
                hand={hand}
                leadSuit={leadSuit}
                enabled={enabled}
                onCardPlayed={onCardPlayed}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        paddingTop: 4,
        paddingBottom: 4
    },

    heading: {
        width: "100%",
        maxWidth: 350,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 3,
        marginBottom: 2
    },

    title: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        lineHeight: 23,
        includeFontPadding: false
    },

    cardCount: {
        color: "#E8F5E9",
        fontSize: 13,
        includeFontPadding: false
    },

    statusMessage: {
        minHeight: 20,
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 19,
        textAlign: "center",
        marginBottom: 6,
        includeFontPadding: false
    },

    highlightedStatus: {
        color: "#FFEB3B"
    }
});