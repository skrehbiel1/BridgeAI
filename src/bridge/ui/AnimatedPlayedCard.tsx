import React, {
    useEffect,
    useRef
} from "react";

import {
    Animated,
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    Card,
    Suit
} from "../cards/Card";

import { Seat } from "../core/Seat";
import { suitSymbol } from "../cards/SuitDisplay";

interface Props {
    card: Card;
    seat: Seat;
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

function startingOffset(
    seat: Seat
): {
    x: number;
    y: number;
} {
    switch (seat) {
        case Seat.North:
            return {
                x: 0,
                y: -35
            };

        case Seat.East:
            return {
                x: 35,
                y: 0
            };

        case Seat.South:
            return {
                x: 0,
                y: 35
            };

        case Seat.West:
            return {
                x: -35,
                y: 0
            };
    }
}

export default function AnimatedPlayedCard({
    card,
    seat
}: Props) {
    const offset =
        startingOffset(seat);

    const translateX =
        useRef(
            new Animated.Value(
                offset.x
            )
        ).current;

    const translateY =
        useRef(
            new Animated.Value(
                offset.y
            )
        ).current;

    const opacity =
        useRef(
            new Animated.Value(0)
        ).current;

    const scale =
        useRef(
            new Animated.Value(0.88)
        ).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(
                translateX,
                {
                    toValue: 0,
                    useNativeDriver: true,
                    friction: 7,
                    tension: 70
                }
            ),

            Animated.spring(
                translateY,
                {
                    toValue: 0,
                    useNativeDriver: true,
                    friction: 7,
                    tension: 70
                }
            ),

            Animated.timing(
                opacity,
                {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true
                }
            ),

            Animated.spring(
                scale,
                {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 7,
                    tension: 70
                }
            )
        ]).start();
    }, [
        opacity,
        scale,
        translateX,
        translateY
    ]);

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    opacity,
                    transform: [
                        {
                            translateX
                        },
                        {
                            translateY
                        },
                        {
                            scale
                        }
                    ]
                }
            ]}
        >
            <View style={styles.cardFace}>
                <Text
                    style={[
                        styles.cardText,
                        {
                            color:
                                suitColor(
                                    card.suit
                                )
                        }
                    ]}
                >
                    {displayRank(card.rank)}
                    {suitSymbol(card.suit)}
                </Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 48,
        height: 58
    },

    cardFace: {
        flex: 1,
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
    }
});