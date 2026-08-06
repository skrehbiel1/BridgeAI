import React, {
    useEffect,
    useRef
} from "react";

import {
    Animated,
    Pressable,
    StyleSheet,
    Text
} from "react-native";

import {
    Card,
    Suit
} from "../cards/Card";

import {
    suitSymbol
} from "../cards/SuitDisplay";

interface Props {
    card: Card;
    onPress?: () => void;
    suggested?: boolean;
    disabled?: boolean;
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
            return rank.toString();
    }
}

function suitColor(
    suit: Suit
): string {
    switch (suit) {
        case Suit.Hearts:
        case Suit.Diamonds:
            return "#C62828";

        default:
            return "#111111";
    }
}

export default function CardView({
    card,
    onPress,
    suggested = false,
    disabled = false
}: Props) {
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

    const borderColor =
        suggested
            ? pulse.interpolate({
                inputRange: [
                    0,
                    1
                ],

                outputRange: [
                    "#2E7D32",
                    "#00C853"
                ]
            })
            : "#333333";

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    borderColor
                },
                suggested &&
                    styles.suggestedCard
            ]}
        >
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                    `${displayRank(
                        card.rank
                    )}${suitSymbol(
                        card.suit
                    )}` +
                    (
                        suggested
                            ? ", suggested card"
                            : ""
                    )
                }
                disabled={disabled}
                onPress={onPress}
                style={({
                    pressed
                }) => [
                    styles.cardPressable,
                    pressed &&
                        !disabled &&
                        styles.pressed
                ]}
            >
                <Text
                    style={[
                        styles.text,
                        {
                            color:
                                suitColor(
                                    card.suit
                                )
                        }
                    ]}
                >
                    {
                        `${displayRank(
                            card.rank
                        )}${suitSymbol(
                            card.suit
                        )}`
                    }
                </Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderRadius: 8,
        margin: 4,
        width: 60,
        height: 60
    },

    cardPressable: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6
    },

    suggestedCard: {
        backgroundColor: "#E8F5E9",
        elevation: 8,
        shadowColor: "#00C853",
        shadowOpacity: 0.45,
        shadowRadius: 7,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },

    pressed: {
        opacity: 0.72,
        transform: [
            {
                scale: 0.95
            }
        ]
    },

    text: {
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 22,
        textAlignVertical: "center",
        includeFontPadding: false
    }
});