import React from "react";

import {
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    Suit
} from "../cards/Card";

import {
    suitSymbol
} from "../cards/SuitDisplay";

import {
    Seat
} from "../core/Seat";

import {
    Auction
} from "../auction/Auction";

import {
    Bid,
    BidSuit
} from "../auction/Bid";

interface Props {
    auction: Auction;
}

const SEATS: Seat[] = [
    Seat.North,
    Seat.East,
    Seat.South,
    Seat.West
];

export default function AuctionHistoryView({
    auction
}: Props) {
    const rows =
        buildAuctionRows(
            auction
        );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Auction
            </Text>

            <View style={styles.headerRow}>
                {SEATS.map(seat => (
                    <Text
                        key={seat}
                        style={styles.seatHeader}
                    >
                        {shortSeatName(seat)}
                    </Text>
                ))}
            </View>

            {rows.length === 0 ? (
                <Text style={styles.emptyText}>
                    Waiting for the opening call
                </Text>
            ) : (
                rows.map(
                    (
                        row,
                        rowIndex
                    ) => (
                        <View
                            key={rowIndex}
                            style={styles.callRow}
                        >
                            {SEATS.map(
                                seat => {
                                    const bid =
                                        row[seat];

                                    return (
                                        <View
                                            key={seat}
                                            style={
                                                styles.callCell
                                            }
                                        >
                                            {bid ? (
                                                <Text
                                                    style={[
                                                        styles.callText,
                                                        {
                                                            color:
                                                                bidColor(
                                                                    bid
                                                                )
                                                        }
                                                    ]}
                                                >
                                                    {formatBid(
                                                        bid
                                                    )}
                                                </Text>
                                            ) : (
                                                <Text
                                                    style={
                                                        styles.emptyCell
                                                    }
                                                >
                                                    —
                                                </Text>
                                            )}
                                        </View>
                                    );
                                }
                            )}
                        </View>
                    )
                )
            )}

            {!auction.isComplete() && (
                <Text style={styles.currentBidder}>
                    Current bidder:{" "}
                    {auction.currentSeat}
                </Text>
            )}
        </View>
    );
}

type AuctionRow =
    Partial<Record<Seat, Bid>>;

function buildAuctionRows(
    auction: Auction
): AuctionRow[] {
    const rows:
        AuctionRow[] = [];

    let currentRow:
        AuctionRow = {};

    let previousSeatIndex =
        seatIndex(
            auction.dealer
        ) - 1;

    for (
        const call of
        auction.calls
    ) {
        const currentSeatIndex =
            seatIndex(
                call.seat
            );

        /*
         * Begin a new row whenever bidding wraps
         * from West back to North.
         */
        if (
            Object.keys(
                currentRow
            ).length > 0 &&
            currentSeatIndex <=
                previousSeatIndex
        ) {
            rows.push(
                currentRow
            );

            currentRow = {};
        }

        currentRow[
            call.seat
        ] = call.bid;

        previousSeatIndex =
            currentSeatIndex;
    }

    if (
        Object.keys(
            currentRow
        ).length > 0
    ) {
        rows.push(
            currentRow
        );
    }

    return rows;
}

function seatIndex(
    seat: Seat
): number {
    return SEATS.indexOf(
        seat
    );
}

function shortSeatName(
    seat: Seat
): string {
    switch (seat) {
        case Seat.North:
            return "N";

        case Seat.East:
            return "E";

        case Seat.South:
            return "S";

        case Seat.West:
            return "W";
    }
}

function formatBid(
    bid: Bid
): string {
    if (bid.isPass()) {
        return "Pass";
    }

    if (bid.isDouble()) {
        return "X";
    }

    if (bid.isRedouble()) {
        return "XX";
    }

    if (
        !bid.isContract() ||
        bid.level === undefined ||
        bid.suit === undefined
    ) {
        return "";
    }

    return (
        `${bid.level}` +
        displaySuit(
            bid.suit
        )
    );
}

function displaySuit(
    suit: BidSuit
): string {
    if (suit === "NT") {
        return "NT";
    }

    return suitSymbol(
        suit
    );
}

function bidColor(
    bid: Bid
): string {
    if (bid.isPass()) {
        return "#666666";
    }

    if (
        bid.suit ===
            Suit.Hearts ||
        bid.suit ===
            Suit.Diamonds
    ) {
        return "#C62828";
    }

    return "#151515";
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        maxWidth: 360,
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#D0D0D0",
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 8,
        elevation: 4,
        shadowColor: "#000000",
        shadowOpacity: 0.18,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },

    title: {
        color: "#173A26",
        fontSize: 19,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 8,
        includeFontPadding: false
    },

    headerRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#DDDDDD",
        paddingBottom: 5
    },

    seatHeader: {
        flex: 1,
        color: "#444444",
        fontSize: 13,
        fontWeight: "800",
        textAlign: "center",
        includeFontPadding: false
    },

    callRow: {
        flexDirection: "row"
    },

    callCell: {
        flex: 1,
        minHeight: 39,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE"
    },

    callText: {
        fontSize: 17,
        fontWeight: "800",
        includeFontPadding: false
    },

    emptyCell: {
        color: "#CCCCCC",
        fontSize: 15,
        includeFontPadding: false
    },

    emptyText: {
        color: "#888888",
        fontSize: 14,
        textAlign: "center",
        paddingVertical: 13,
        includeFontPadding: false
    },

    currentBidder: {
        color: "#555555",
        fontSize: 12,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 7,
        includeFontPadding: false
    }
});