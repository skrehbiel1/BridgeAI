import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    Card,
    Suit
} from "../cards/Card";

import { Hand } from "../cards/Hand";
import { suitSymbol } from "../cards/SuitDisplay";

interface Props {
    hand: Hand;
    leadSuit?: Suit;
    enabled?: boolean;
    onCardPlayed?: (
        index: number
    ) => void;
}

interface SuitRowProps {
    suit: Suit;
    hand: Hand;
    leadSuit?: Suit;
    enabled: boolean;
    onCardPlayed?: (
        index: number
    ) => void;
}

const SUIT_ORDER: Suit[] = [
    Suit.Spades,
    Suit.Hearts,
    Suit.Diamonds,
    Suit.Clubs
];

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
        return "#D32F2F";
    }

    return "#151515";
}

function isLegalCard(
    card: Card,
    hand: Hand,
    leadSuit?: Suit
): boolean {
    if (leadSuit === undefined) {
        return true;
    }

    if (!hand.hasSuit(leadSuit)) {
        return true;
    }

    return card.suit === leadSuit;
}

function SuitRow({
    suit,
    hand,
    leadSuit,
    enabled,
    onCardPlayed
}: SuitRowProps) {
    const cards =
        hand.cards.filter(
            card =>
                card.suit === suit
        );

    return (
        <View style={styles.suitRow}>
            <Text
                style={[
                    styles.suitSymbol,
                    {
                        color:
                            suitColor(suit)
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
                    const handIndex =
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
                        <Pressable
                            key={
                                `${card.suit}-${card.rank}`
                            }
                            accessibilityRole="button"
                            accessibilityLabel={
                                `${displayRank(card.rank)} ` +
                                `${suitSymbol(card.suit)}`
                            }
                            disabled={!legal}
                            onPress={() => {
                                if (
                                    legal &&
                                    handIndex >= 0
                                ) {
                                    onCardPlayed?.(
                                        handIndex
                                    );
                                }
                            }}
                            style={({ pressed }) => [
                                styles.rankButton,
                                legal &&
                                    styles.legalButton,
                                pressed &&
                                    legal &&
                                    styles.pressedButton
                            ]}
                        >
                            <Text
                                style={[
                                    styles.rankText,
                                    {
                                        color:
                                            legal
                                                ? suitColor(
                                                    suit
                                                )
                                                : "#C7C7C7"
                                    }
                                ]}
                            >
                                {displayRank(
                                    card.rank
                                )}
                            </Text>
                        </Pressable>
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
            {SUIT_ORDER.map(suit => (
                <SuitRow
                    key={suit}
                    suit={suit}
                    hand={hand}
                    leadSuit={leadSuit}
                    enabled={enabled}
                    onCardPlayed={
                        onCardPlayed
                    }
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        maxWidth: 350,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D3D3D3",
        borderRadius: 11,
        paddingHorizontal: 10,
        paddingVertical: 5,
        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },

    suitRow: {
        minHeight: 37,
        flexDirection: "row",
        alignItems: "center"
    },

    suitSymbol: {
        width: 42,
        fontSize: 29,
        fontWeight: "800",
        lineHeight: 33,
        textAlign: "center",
        includeFontPadding: false
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
        marginRight: 2,
        paddingHorizontal: 4,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },

    legalButton: {
        backgroundColor: "#F1F8E9"
    },

    pressedButton: {
        backgroundColor: "#C8E6C9",
        transform: [
            {
                scale: 0.94
            }
        ]
    },

    rankText: {
        fontSize: 19,
        fontWeight: "800",
        lineHeight: 23,
        includeFontPadding: false
    },

    voidText: {
        color: "#A0A0A0",
        fontSize: 20,
        paddingLeft: 5,
        includeFontPadding: false
    }
});