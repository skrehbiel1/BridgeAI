import React from "react";

import {
    StyleSheet,
    Text,
    View
} from "react-native";

import CardBackView from "./CardBackView";

interface Props {
    name: string;
    cardCount: number;
    orientation?: "horizontal" | "vertical";
    active?: boolean;
}

const MAX_VISIBLE_CARD_BACKS = 7;

export default function SeatView({
    name,
    cardCount,
    orientation = "horizontal",
    active = false
}: Props) {
    const visibleCardCount =
        Math.min(
            cardCount,
            MAX_VISIBLE_CARD_BACKS
        );

    return (
        <View
            style={[
                styles.container,
                active &&
                    styles.activeContainer
            ]}
        >
            <Text
                style={[
                    styles.name,
                    active &&
                        styles.activeName
                ]}
            >
                {name}
            </Text>

            <View
                style={[
                    styles.cardStack,
                    orientation === "horizontal"
                        ? styles.horizontalStack
                        : styles.verticalStack
                ]}
            >
                {Array.from({
                    length: visibleCardCount
                }).map((_, index) => (
                    <View
                        key={index}
                        style={
                            orientation ===
                            "horizontal"
                                ? [
                                    styles.horizontalCard,
                                    index > 0 &&
                                        styles.horizontalOverlap
                                ]
                                : [
                                    styles.verticalCard,
                                    index > 0 &&
                                        styles.verticalOverlap
                                ]
                        }
                    >
                        <CardBackView
                            orientation={
                                orientation
                            }
                        />
                    </View>
                ))}
            </View>

            <Text style={styles.cardCount}>
                {cardCount}{" "}
                {cardCount === 1
                    ? "card"
                    : "cards"}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minWidth: 68,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 4
    },

    activeContainer: {
        backgroundColor:
            "rgba(255, 235, 59, 0.18)"
    },

    name: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
        lineHeight: 19,
        marginBottom: 3,
        includeFontPadding: false
    },

    activeName: {
        color: "#FFEB3B"
    },

    cardStack: {
        alignItems: "center",
        justifyContent: "center"
    },

    horizontalStack: {
        minWidth: 104,
        height: 50,
        flexDirection: "row"
    },

    verticalStack: {
        width: 30,
        minHeight: 91,
        flexDirection: "column"
    },

    horizontalCard: {
        zIndex: 1
    },

    horizontalOverlap: {
        marginLeft: -22
    },

    verticalCard: {
        zIndex: 1
    },

    verticalOverlap: {
        marginTop: -27
    },

    cardCount: {
        color: "#E8F5E9",
        fontSize: 11,
        lineHeight: 15,
        marginTop: 3,
        includeFontPadding: false
    }
});