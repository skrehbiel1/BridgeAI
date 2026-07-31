import React from "react";

import {
    View,
    Text,
    StyleSheet
} from "react-native";

import CardBackView from "./CardBackView";

interface Props {
    name: string;
    cardCount: number;
    orientation?: "horizontal" | "vertical";
    active?: boolean;
}

export default function SeatView({
    name,
    cardCount,
    orientation = "horizontal",
    active = false
}: Props) {
    const visibleCards = Math.min(cardCount, 7);

    return (
        <View
            style={[
                styles.container,
                active && styles.activeContainer
            ]}
        >
            <Text
                style={[
                    styles.name,
                    active && styles.activeName
                ]}
            >
                {name}
            </Text>

            <View
                style={[
                    styles.cards,
                    orientation === "vertical"
                        ? styles.verticalCards
                        : styles.horizontalCards
                ]}
            >
                {Array.from({
                    length: visibleCards
                }).map((_, index) => (
                    <View
                        key={index}
                        style={
                            orientation === "vertical"
                                ? {
                                    marginTop:
                                        index === 0
                                            ? 0
                                            : -27
                                }
                                : {
                                    marginLeft:
                                        index === 0
                                            ? 0
                                            : -23
                                }
                        }
                    >
                        <CardBackView
                            orientation={orientation}
                        />
                    </View>
                ))}
            </View>

            <Text style={styles.count}>
                {cardCount} cards
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        borderRadius: 10,
        minWidth: 72
    },

    activeContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.18)"
    },

    name: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 4
    },

    activeName: {
        color: "#FFEB3B"
    },

    cards: {
        alignItems: "center",
        justifyContent: "center"
    },

    horizontalCards: {
        flexDirection: "row",
        minWidth: 100
    },

    verticalCards: {
        flexDirection: "column",
        minHeight: 90
    },

    count: {
        color: "#FFFFFF",
        fontSize: 12,
        marginTop: 3
    }
});