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
import { Seat } from "../core/Seat";

import {
    suitSymbol
} from "../cards/SuitDisplay";

interface Props {
    seat: Seat;
    hand: Hand;
    active: boolean;
}

const SUIT_ORDER: Suit[] = [
    Suit.Spades,
    Suit.Hearts,
    Suit.Diamonds,
    Suit.Clubs
];

export default function SideDummyHandView({
    seat,
    hand,
    active
}: Props) {
    return (
        <View
            style={[
                styles.container,
                active &&
                    styles.activeContainer
            ]}
        >
            <Text style={styles.title}>
                {seat}
            </Text>

            <Text style={styles.subtitle}>
                Dummy
            </Text>

            {SUIT_ORDER.map(suit => {
                const cards =
                    hand.cards.filter(
                        card =>
                            card.suit === suit
                    );

                return (
                    <View
                        key={suit}
                        style={styles.suitRow}
                    >
                        <Text
                            style={[
                                styles.suitSymbol,
                                {
                                    color:
                                        suitColor(
                                            suit
                                        )
                                }
                            ]}
                        >
                            {suitSymbol(suit)}
                        </Text>

                        <Text
                            style={[
                                styles.ranks,
                                {
                                    color:
                                        suitColor(
                                            suit
                                        )
                                }
                            ]}
                            numberOfLines={2}
                        >
                            {cards.length > 0
                                ? cards
                                    .map(card =>
                                        displayRank(
                                            card.rank
                                        )
                                    )
                                    .join(" ")
                                : "—"}
                        </Text>
                    </View>
                );
            })}

            <Text style={styles.cardCount}>
                {hand.cards.length}{" "}
                {hand.cards.length === 1
                    ? "card"
                    : "cards"}
            </Text>
        </View>
    );
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

        case 10:
            return "10";

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

    return "#151515";
}

const styles = StyleSheet.create({
    container: {
        width: 102,
        minHeight: 178,
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#D0D0D0",
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingTop: 6,
        paddingBottom: 5,

        elevation: 4,

        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },

    activeContainer: {
        borderColor: "#FFEB3B",
        borderWidth: 3,
        backgroundColor: "#FFFDE7"
    },

    title: {
        color: "#173A26",
        fontSize: 14,
        fontWeight: "900",
        textAlign: "center",
        includeFontPadding: false
    },

    subtitle: {
        color: "#5B6A5E",
        fontSize: 11,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 4,
        includeFontPadding: false
    },

    suitRow: {
        minHeight: 29,
        flexDirection: "row",
        alignItems: "flex-start"
    },

    suitSymbol: {
        width: 23,
        fontSize: 20,
        fontWeight: "900",
        lineHeight: 24,
        textAlign: "center",
        includeFontPadding: false
    },

    ranks: {
        flex: 1,
        fontSize: 13,
        fontWeight: "800",
        lineHeight: 17,
        paddingTop: 3,
        includeFontPadding: false
    },

    cardCount: {
        color: "#777777",
        fontSize: 10,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 3,
        includeFontPadding: false
    }
});