import React from "react";

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { Card, Suit } from "../cards/Card";
import { Hand } from "../cards/Hand";
import { suitSymbol } from "../cards/SuitDisplay";

interface Props {
    hand: Hand;
    leadSuit?: Suit;
    enabled?: boolean;
    onCardPlayed?: (index: number) => void;
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
        return "#F44336";
    }

    return "#222222";
}

function isLegalCard(
    card: Card,
    hand: Hand,
    leadSuit?: Suit
): boolean {
    if (leadSuit === undefined) {
        return true;
    }

    const mustFollowSuit =
        hand.cards.some(
            current =>
                current.suit === leadSuit
        );

    if (!mustFollowSuit) {
        return true;
    }

    return card.suit === leadSuit;
}

interface SuitRowProps {
    suit: Suit;
    hand: Hand;
    leadSuit?: Suit;
    enabled: boolean;
    onCardPlayed?: (index: number) => void;
}

function SuitRow({
    suit,
    hand,
    leadSuit,
    enabled,
    onCardPlayed
}: SuitRowProps) {
    const cards = hand.cards.filter(
        card => card.suit === suit
    );

    return (
        <View style={styles.suitRow}>
            <Text
                style={[
                    styles.suitSymbol,
                    {
                        color: suitColor(suit)
                    }
                ]}
            >
                {suitSymbol(suit)}
            </Text>

            <View style={styles.rankRow}>
                {cards.length === 0 && (
                    <Text style={styles.voidText}>
                        —
                    </Text>
                )}

                {cards.map(card => {
                    const index =
                        hand.cards.findIndex(
                            current =>
                                current.suit ===
                                    card.suit &&
                                current.rank ===
                                    card.rank
                        );

                    const legal =
                        enabled &&
                        isLegalCard(
                            card,
                            hand,
                            leadSuit
                        );

                    return (
                        <TouchableOpacity
                            key={`${card.suit}-${card.rank}`}
                            disabled={!legal}
                            style={styles.rankButton}
                            onPress={() => {
                                if (
                                    legal &&
                                    index >= 0 &&
                                    onCardPlayed
                                ) {
                                    onCardPlayed(index);
                                }
                            }}
                        >
                            <Text
                                style={[
                                    styles.rankText,
                                    {
                                        color: legal
                                            ? suitColor(suit)
                                            : "#D2D2D2"
                                    }
                                ]}
                            >
                                {displayRank(card.rank)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

export default function HandView({
    hand,
    leadSuit,
    enabled = true,
    onCardPlayed
}: Props) {
    return (
        <View style={styles.container}>
            <SuitRow
                suit={Suit.Spades}
                hand={hand}
                leadSuit={leadSuit}
                enabled={enabled}
                onCardPlayed={onCardPlayed}
            />

            <SuitRow
                suit={Suit.Hearts}
                hand={hand}
                leadSuit={leadSuit}
                enabled={enabled}
                onCardPlayed={onCardPlayed}
            />

            <SuitRow
                suit={Suit.Diamonds}
                hand={hand}
                leadSuit={leadSuit}
                enabled={enabled}
                onCardPlayed={onCardPlayed}
            />

            <SuitRow
                suit={Suit.Clubs}
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
        maxWidth: 340,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#D0D0D0",
        paddingHorizontal: 10,
        paddingVertical: 4
    },

    suitRow: {
        minHeight: 36,
        flexDirection: "row",
        alignItems: "center"
    },

    suitSymbol: {
        width: 42,
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        includeFontPadding: false,
        lineHeight: 34
    },

    rankRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap"
    },

    rankButton: {
        minWidth: 34,
        height: 32,
        paddingHorizontal: 4,
        justifyContent: "center",
        alignItems: "center"
    },

    rankText: {
        fontSize: 19,
        fontWeight: "bold",
        includeFontPadding: false,
        lineHeight: 24
    },

    voidText: {
        fontSize: 19,
        color: "#AAAAAA",
        paddingLeft: 4
    }
});