import React, {
    useEffect,
    useRef
} from "react";

import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    Card,
    Suit
} from "../cards/Card";

import {TrumpSuit} from "../play/Contract";

import { Hand } from "../cards/Hand";
import { suitSymbol } from "../cards/SuitDisplay";

interface Props {
    hand: Hand;
    leadSuit?: Suit;
    enabled?: boolean;

    suggestedCard?: Card;
    trump?: TrumpSuit;
    onCardPlayed?: (
        index: number
    ) => void;
}

interface SuitRowProps {
    suit: Suit;
    hand: Hand;
    leadSuit?: Suit;
    enabled: boolean;

    suggestedCard?: Card;

    onCardPlayed?: (
        index: number
    ) => void;
}

interface RankButtonProps {
    card: Card;
    legal: boolean;
    suggested: boolean;
    onPress: () => void;
}

function suitOrder(
    trump?: TrumpSuit
): Suit[] {
    const standardOrder: Suit[] = [
        Suit.Spades,
        Suit.Hearts,
        Suit.Diamonds,
        Suit.Clubs
    ];

    /*
     * No Trump uses the normal
     * Spades-Hearts-Diamonds-Clubs order.
     */
    if (
        trump === undefined ||
        trump === "NT"
    ) {
        return standardOrder;
    }

    /*
     * Put trump first, followed by the
     * remaining suits in normal order.
     */
    return [
        trump,
        ...standardOrder.filter(
            suit =>
                suit !== trump
        )
    ];
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

function cardsMatch(
    first: Card,
    second?: Card
): boolean {
    if (!second) {
        return false;
    }

    return (
        first.suit === second.suit &&
        first.rank === second.rank
    );
}

function RankButton({
    card,
    legal,
    suggested,
    onPress
}: RankButtonProps) {
    const pulse =
        useRef(
            new Animated.Value(0)
        ).current;

    useEffect(() => {
        if (!suggested) {
            pulse.stopAnimation();
            pulse.setValue(0);
            return;
        }

        const animation =
            Animated.loop(
                Animated.sequence([
                    Animated.timing(
                        pulse,
                        {
                            toValue: 1,
                            duration: 650,
                            useNativeDriver:
                                false
                        }
                    ),

                    Animated.timing(
                        pulse,
                        {
                            toValue: 0,
                            duration: 650,
                            useNativeDriver:
                                false
                        }
                    )
                ])
            );

        animation.start();

        return () => {
            animation.stop();
        };
    }, [
        pulse,
        suggested
    ]);

    const suggestedBackground =
        pulse.interpolate({
            inputRange: [
                0,
                1
            ],

            outputRange: [
                "#E8F5E9",
                "#A5D6A7"
            ]
        });

    const suggestedBorder =
        pulse.interpolate({
            inputRange: [
                0,
                1
            ],

            outputRange: [
                "#2E7D32",
                "#00C853"
            ]
        });

    return (
        <Animated.View
            style={[
                styles.rankButtonWrapper,
                suggested && {
                    backgroundColor:
                        suggestedBackground,

                    borderColor:
                        suggestedBorder
                }
            ]}
        >
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                    `${displayRank(
                        card.rank
                    )} ` +
                    `${suitSymbol(
                        card.suit
                    )}` +
                    (
                        suggested
                            ? ", suggested play"
                            : ""
                    )
                }
                disabled={!legal}
                onPress={onPress}
                style={({
                    pressed
                }) => [
                    styles.rankButton,
                    legal &&
                        styles.legalButton,
                    suggested &&
                        styles.suggestedButton,
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
                suitColor(
                    card.suit
                )
        }
    ]}
>
                    {displayRank(
                        card.rank
                    )}
                </Text>

                {suggested && (
                    <View
                        style={
                            styles.hintBadge
                        }
                    >
                        <Text
                            style={
                                styles.hintBadgeText
                            }
                        >
                            ✓
                        </Text>
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );
}

function SuitRow({
    suit,
    hand,
    leadSuit,
    enabled,
    suggestedCard,
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

                    const suggested =
                        legal &&
                        cardsMatch(
                            card,
                            suggestedCard
                        );

                    return (
                        <RankButton
                            key={
                                `${card.suit}-${card.rank}`
                            }
                            card={card}
                            legal={legal}
                            suggested={
                                suggested
                            }
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
                        />
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
    suggestedCard,
    trump,
    onCardPlayed
}: Props) {
    const orderedSuits =
        suitOrder(trump);

    return (
        <View style={styles.container}>
            {orderedSuits.map(suit => (
                <SuitRow
                    key={suit}
                    suit={suit}
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
        minHeight: 39,
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

rankButtonWrapper: {
    minWidth: 38,
    height: 35,
    marginRight: 3,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "transparent"
},

    rankButton: {
        flex: 1,
        position: "relative",
        paddingHorizontal: 4,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
    },

    legalButton: {
        backgroundColor: "#F1F8E9"
    },

    suggestedButton: {
        backgroundColor: "transparent"
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
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 25,
    includeFontPadding: false
},

    hintBadge: {
        position: "absolute",
        top: -5,
        right: -4,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#1B5E20",
        alignItems: "center",
        justifyContent: "center"
    },

    hintBadgeText: {
        color: "#FFFFFF",
        fontSize: 9,
        fontWeight: "900",
        includeFontPadding: false
    },

    voidText: {
        color: "#A0A0A0",
        fontSize: 20,
        paddingLeft: 5,
        includeFontPadding: false
    }
});