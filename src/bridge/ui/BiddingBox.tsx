	import React from "react";

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import { Suit } from "../cards/Card";
import { suitSymbol } from "../cards/SuitDisplay";

import { Auction } from "../auction/Auction";

import {
    Bid,
    BidSuit
} from "../auction/Bid";

interface Props {
    auction: Auction;
    disabled?: boolean;

    onBid: (
        bid: Bid
    ) => void;
}

const BID_SUITS: BidSuit[] = [
    Suit.Clubs,
    Suit.Diamonds,
    Suit.Hearts,
    Suit.Spades,
    "NT"
];

const BID_LEVELS = [
    1,
    2,
    3,
    4,
    5,
    6,
    7
];

export default function BiddingBox({
    auction,
    disabled = false,
    onBid
}: Props) {
    function submitBid(
        bid: Bid
    ): void {
        if (disabled) {
            return;
        }

        onBid(bid);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Your Bid
            </Text>

            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Pass"
                disabled={disabled}
                onPress={() =>
                    submitBid(
                        Bid.Pass()
                    )
                }
                style={({ pressed }) => [
                    styles.passButton,
                    disabled &&
                        styles.disabledPassButton,
                    pressed &&
                        !disabled &&
                        styles.pressedButton
                ]}
            >
                <Text
                    style={[
                        styles.passText,
                        disabled &&
                            styles.disabledPassText
                    ]}
                >
                    Pass
                </Text>
            </Pressable>

            <View style={styles.headerRow}>
                <View style={styles.levelSpacer} />

                {BID_SUITS.map(suit => (
                    <Text
                        key={suit}
                        style={[
                            styles.suitHeader,
                            {
                                color:
                                    suitColor(suit)
                            }
                        ]}
                    >
                        {displaySuit(suit)}
                    </Text>
                ))}
            </View>

            <ScrollView
                style={styles.bidScroll}
                contentContainerStyle={
                    styles.bidScrollContent
                }
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
            >
                {BID_LEVELS.map(level => (
                    <View
                        key={level}
                        style={styles.bidRow}
                    >
                        <Text style={styles.levelText}>
                            {level}
                        </Text>

                        {BID_SUITS.map(suit => {
                            const bid =
                                Bid.Contract(
                                    level,
                                    suit
                                );

                            const legal =
                                !disabled &&
                                auction.isLegalBid(
                                    bid
                                );

                            return (
                                <Pressable
                                    key={`${level}-${suit}`}
                                    accessibilityRole="button"
                                    accessibilityLabel={
                                        formatBidLabel(
                                            bid
                                        )
                                    }
                                    disabled={!legal}
                                    onPress={() =>
                                        submitBid(bid)
                                    }
                                    style={({
                                        pressed
                                    }) => [
                                        styles.bidButton,
                                        legal
                                            ? styles.legalBidButton
                                            : styles.disabledBidButton,
                                        pressed &&
                                            legal &&
                                            styles.pressedButton
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.bidText,
                                            {
                                                color:
                                                    legal
                                                        ? suitColor(
                                                            suit
                                                        )
                                                        : "#A8A8A8"
                                            }
                                        ]}
                                    >
                                        {displaySuit(
                                            suit
                                        )}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

function displaySuit(
    suit: BidSuit
): string {
    if (suit === "NT") {
        return "NT";
    }

    return suitSymbol(suit);
}

function suitColor(
    suit: BidSuit
): string {
    if (
        suit === Suit.Hearts ||
        suit === Suit.Diamonds
    ) {
        return "#C62828";
    }

    return "#151515";
}

function formatBidLabel(
    bid: Bid
): string {
    if (bid.isPass()) {
        return "Pass";
    }

    if (bid.isDouble()) {
        return "Double";
    }

    if (bid.isRedouble()) {
        return "Redouble";
    }

    if (
        !bid.isContract() ||
        bid.level === undefined ||
        bid.suit === undefined
    ) {
        return "Invalid bid";
    }

    if (bid.suit === "NT") {
        return `${bid.level} notrump`;
    }

    return (
        `${bid.level} ` +
        suitName(
            bid.suit
        )
    );
}
function suitName(
    suit: Suit
): string {
    switch (suit) {
        case Suit.Clubs:
            return "clubs";

        case Suit.Diamonds:
            return "diamonds";

        case Suit.Hearts:
            return "hearts";

        case Suit.Spades:
            return "spades";
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        maxWidth: 360,
        maxHeight: 390,
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#D0D0D0",
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 8,
        elevation: 5,
        shadowColor: "#000000",
        shadowOpacity: 0.22,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 3
        }
    },

    title: {
        color: "#173A26",
        fontSize: 20,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 7,
        includeFontPadding: false
    },

    passButton: {
        minHeight: 40,
        marginBottom: 7,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#F9A825",
        backgroundColor: "#FFEB3B",
        alignItems: "center",
        justifyContent: "center"
    },

    disabledPassButton: {
        backgroundColor: "#E0E0E0",
        borderColor: "#C4C4C4"
    },

    passText: {
        color: "#1B1B1B",
        fontSize: 17,
        fontWeight: "800",
        includeFontPadding: false
    },

    disabledPassText: {
        color: "#929292"
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4
    },

    levelSpacer: {
        width: 28
    },

    suitHeader: {
        flex: 1,
        fontSize: 18,
        fontWeight: "800",
        textAlign: "center",
        includeFontPadding: false
    },

    bidScroll: {
        maxHeight: 245
    },

    bidScrollContent: {
        paddingBottom: 3
    },

    bidRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4
    },

    levelText: {
        width: 28,
        color: "#444444",
        fontSize: 17,
        fontWeight: "800",
        textAlign: "center",
        includeFontPadding: false
    },

    bidButton: {
        flex: 1,
        minHeight: 36,
        marginHorizontal: 2,
        borderRadius: 7,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    legalBidButton: {
        backgroundColor: "#F5FBF6",
        borderColor: "#8AB694"
    },

    disabledBidButton: {
        backgroundColor: "#EEEEEE",
        borderColor: "#DDDDDD"
    },

    bidText: {
        fontSize: 18,
        fontWeight: "800",
        includeFontPadding: false
    },

    pressedButton: {
        opacity: 0.72,
        transform: [
            {
                scale: 0.97
            }
        ]
    }
});