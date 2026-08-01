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
    winner?: boolean;
    collectToSeat?: Seat;
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
            return String(rank);
    }
}

function suitColor(
    suit: Suit
): string {
    return suit === Suit.Hearts ||
        suit === Suit.Diamonds
        ? "#C62828"
        : "#111111";
}

function startingOffset(
    seat: Seat
) {
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

function collectionOffset(
    seat: Seat
) {
    switch (seat) {
        case Seat.North:
            return {
                x: 0,
                y: -140
            };

        case Seat.East:
            return {
                x: 140,
                y: 0
            };

        case Seat.South:
            return {
                x: 0,
                y: 140
            };

        case Seat.West:
            return {
                x: -140,
                y: 0
            };
    }
}

export default function AnimatedPlayedCard({
    card,
    seat,
    winner = false,
    collectToSeat
}: Props) {

    const start =
        startingOffset(seat);

    const translateX =
        useRef(
            new Animated.Value(start.x)
        ).current;

    const translateY =
        useRef(
            new Animated.Value(start.y)
        ).current;

    const opacity =
        useRef(
            new Animated.Value(0)
        ).current;

    const scale =
        useRef(
            new Animated.Value(0.85)
        ).current;

    //
    // Entrance animation
    //
    useEffect(() => {

        Animated.parallel([

            Animated.spring(
                translateX,
                {
                    toValue: 0,
                    useNativeDriver: true
                }
            ),

            Animated.spring(
                translateY,
                {
                    toValue: 0,
                    useNativeDriver: true
                }
            ),

            Animated.spring(
                scale,
                {
                    toValue: 1,
                    useNativeDriver: true
                }
            ),

            Animated.timing(
                opacity,
                {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true
                }
            )

        ]).start();

    }, []);

    //
    // Collect trick animation
    //
    useEffect(() => {

        if (collectToSeat === undefined) {
            return;
        }

        const target =
            collectionOffset(
                collectToSeat
            );

        Animated.parallel([

            Animated.timing(
                translateX,
                {
                    toValue: target.x,
                    duration: 280,
                    useNativeDriver: true
                }
            ),

            Animated.timing(
                translateY,
                {
                    toValue: target.y,
                    duration: 280,
                    useNativeDriver: true
                }
            ),

            Animated.timing(
                opacity,
                {
                    toValue: 0,
                    duration: 280,
                    useNativeDriver: true
                }
            ),

            Animated.timing(
                scale,
                {
                    toValue: 0.7,
                    duration: 280,
                    useNativeDriver: true
                }
            )

        ]).start();

    }, [collectToSeat]);

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

            <View
                style={[
                    styles.cardFace,
                    winner &&
                        styles.winningCard
                ]}
            >

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
                    {displayRank(
                        card.rank
                    )}
                    {suitSymbol(
                        card.suit
                    )}
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
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#333333",
        alignItems: "center",
        justifyContent: "center",

        elevation: 4,

        shadowColor: "#000",

        shadowOpacity: 0.25,

        shadowRadius: 3,

        shadowOffset: {
            width: 0,
            height: 2
        }
    },

    winningCard: {

        borderColor: "#FFD600",

        borderWidth: 3,

        backgroundColor: "#FFFDE7",

        elevation: 10,

        shadowOpacity: 0.55,

        shadowRadius: 8

    },

    cardText: {

        fontSize: 18,

        fontWeight: "700",

        includeFontPadding: false

    }

});