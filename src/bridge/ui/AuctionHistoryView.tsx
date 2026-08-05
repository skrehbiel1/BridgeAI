import React, {
    useState
} from "react";

import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import { Suit } from "../cards/Card";
import { suitSymbol } from "../cards/SuitDisplay";

import { Seat } from "../core/Seat";

import { Auction } from "../auction/Auction";
import { AuctionCall } from "../auction/AuctionCall";

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

type AuctionRow =
    Partial<
        Record<
            Seat,
            AuctionCall
        >
    >;

export default function AuctionHistoryView({
    auction
}: Props) {
    const [
        selectedCall,
        setSelectedCall
    ] = useState<
        AuctionCall | null
    >(null);

    const rows =
        buildAuctionRows(
            auction
        );

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Auction
                </Text>

                <View style={styles.headerRow}>
                    {SEATS.map(seat => (
                        <Text
                            key={seat}
                            style={
                                styles.seatHeader
                            }
                        >
                            {shortSeatName(
                                seat
                            )}
                        </Text>
                    ))}
                </View>

                {rows.length === 0 ? (
                    <Text
                        style={
                            styles.emptyText
                        }
                    >
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
                                style={
                                    styles.callRow
                                }
                            >
                                {SEATS.map(
                                    seat => {
                                        const call =
                                            row[
                                                seat
                                            ];

                                        return (
                                            <View
                                                key={
                                                    seat
                                                }
                                                style={
                                                    styles.callCell
                                                }
                                            >
                                                {call ? (
                                                    <Pressable
                                                        accessibilityRole="button"
                                                        accessibilityLabel={
                                                            `Explain ${formatBid(
                                                                call.bid
                                                            )} by ${call.seat}`
                                                        }
                                                        onPress={() =>
                                                            setSelectedCall(
                                                                call
                                                            )
                                                        }
                                                        style={({
                                                            pressed
                                                        }) => [
                                                            styles.callButton,
                                                            pressed &&
                                                                styles.callButtonPressed
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.callText,
                                                                {
                                                                    color:
                                                                        bidColor(
                                                                            call.bid
                                                                        )
                                                                }
                                                            ]}
                                                        >
                                                            {formatBid(
                                                                call.bid
                                                            )}
                                                        </Text>

                                                        {call.explanation && (
                                                            <Text
                                                                style={
                                                                    styles.explanationIndicator
                                                                }
                                                            >
                                                                ?
                                                            </Text>
                                                        )}
                                                    </Pressable>
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
                    <Text
                        style={
                            styles.currentBidder
                        }
                    >
                        Current bidder:{" "}
                        {auction.currentSeat}
                    </Text>
                )}

                {auction.calls.length > 0 && (
                    <Text style={styles.tapHint}>
                        Tap a call for an explanation
                    </Text>
                )}
            </View>

            <CallExplanationModal
                call={selectedCall}
                onClose={() =>
                    setSelectedCall(
                        null
                    )
                }
            />
        </>
    );
}

function CallExplanationModal({
    call,
    onClose
}: {
    call: AuctionCall | null;
    onClose: () => void;
}) {
    if (!call) {
        return null;
    }

    const explanation =
        call.explanation;

    return (
        <Modal
            visible
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalBackdrop}>
                <View
                    style={
                        styles.modalPanel
                    }
                >
                    <View
                        style={
                            styles.modalHeader
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.modalCall
                                }
                            >
                                {formatBid(
                                    call.bid
                                )}
                            </Text>

                            <Text
                                style={
                                    styles.modalSeat
                                }
                            >
                                Bid by{" "}
                                {call.seat}
                            </Text>
                        </View>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Close explanation"
                            onPress={onClose}
                            style={({
                                pressed
                            }) => [
                                styles.closeButton,
                                pressed &&
                                    styles.closeButtonPressed
                            ]}
                        >
                            <Text
                                style={
                                    styles.closeButtonText
                                }
                            >
                                Close
                            </Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={
                            false
                        }
                        contentContainerStyle={
                            styles.modalContent
                        }
                    >
                        {explanation ? (
                            <>
                                <Text
                                    style={
                                        styles.explanationTitle
                                    }
                                >
                                    {
                                        explanation.title
                                    }
                                </Text>

                                <Text
                                    style={
                                        styles.ruleLabel
                                    }
                                >
                                    Rule
                                </Text>

                                <Text
                                    style={
                                        styles.ruleText
                                    }
                                >
                                    {
                                        explanation.rule
                                    }
                                </Text>

                                <Text
                                    style={
                                        styles.summaryText
                                    }
                                >
                                    {
                                        explanation.summary
                                    }
                                </Text>

                                <View
                                    style={
                                        styles.hcpCard
                                    }
                                >
                                    <Text
                                        style={
                                            styles.hcpNumber
                                        }
                                    >
                                        {
                                            explanation.highCardPoints
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.hcpLabel
                                        }
                                    >
                                        High-card points
                                    </Text>
                                </View>

                                <ExplanationSection
                                    title="Hand facts"
                                    entries={
                                        explanation.facts
                                    }
                                />

                                <ExplanationSection
                                    title="Other considerations"
                                    entries={
                                        explanation.alternatives
                                    }
                                />
                            </>
                        ) : (
                            <>
                                <Text
                                    style={
                                        styles.explanationTitle
                                    }
                                >
                                    No explanation recorded
                                </Text>

                                <Text
                                    style={
                                        styles.summaryText
                                    }
                                >
                                    This call was entered by the human player, or it was created before bid explanations were enabled.
                                </Text>
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

function ExplanationSection({
    title,
    entries
}: {
    title: string;
    entries: string[];
}) {
    if (entries.length === 0) {
        return null;
    }

    return (
        <View style={styles.section}>
            <Text
                style={
                    styles.sectionTitle
                }
            >
                {title}
            </Text>

            {entries.map(
                (
                    entry,
                    index
                ) => (
                    <View
                        key={`${entry}-${index}`}
                        style={
                            styles.entryRow
                        }
                    >
                        <Text
                            style={
                                styles.entryBullet
                            }
                        >
                            •
                        </Text>

                        <Text
                            style={
                                styles.entryText
                            }
                        >
                            {entry}
                        </Text>
                    </View>
                )
            )}
        </View>
    );
}

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
         * Start a new row whenever the auction
         * wraps from a later column back to an
         * earlier column.
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
        ] = call;

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

    if (bid.isDouble()) {
        return "#B71C1C";
    }

    if (bid.isRedouble()) {
        return "#0D47A1";
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
        minHeight: 43,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE"
    },

    callButton: {
        minWidth: 56,
        minHeight: 35,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7,
        paddingHorizontal: 5
    },

    callButtonPressed: {
        backgroundColor: "#EEF4EF",
        opacity: 0.72
    },

    callText: {
        fontSize: 17,
        fontWeight: "800",
        includeFontPadding: false
    },

    explanationIndicator: {
        color: "#2E7D32",
        fontSize: 11,
        fontWeight: "900",
        marginLeft: 3,
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
    },

    tapHint: {
        color: "#777777",
        fontSize: 11,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 6,
        includeFontPadding: false
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor:
            "rgba(0, 0, 0, 0.52)",
        justifyContent: "flex-end"
    },

    modalPanel: {
        maxHeight: "82%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 14,
        paddingHorizontal: 18,
        paddingBottom: 24
    },

    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#E3E3E3",
        paddingBottom: 12
    },

    modalCall: {
        color: "#173A26",
        fontSize: 27,
        fontWeight: "900",
        includeFontPadding: false
    },

    modalSeat: {
        color: "#666666",
        fontSize: 13,
        fontWeight: "600",
        marginTop: 2,
        includeFontPadding: false
    },

    closeButton: {
        minWidth: 70,
        minHeight: 38,
        backgroundColor: "#EDF5EF",
        borderWidth: 1,
        borderColor: "#B8D0BD",
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12
    },

    closeButtonPressed: {
        opacity: 0.7
    },

    closeButtonText: {
        color: "#173A26",
        fontSize: 14,
        fontWeight: "800",
        includeFontPadding: false
    },

    modalContent: {
        paddingTop: 16,
        paddingBottom: 15
    },

    explanationTitle: {
        color: "#173A26",
        fontSize: 23,
        fontWeight: "900",
        marginBottom: 14,
        includeFontPadding: false
    },

    ruleLabel: {
        color: "#777777",
        fontSize: 12,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        includeFontPadding: false
    },

    ruleText: {
        color: "#1B1B1B",
        fontSize: 18,
        fontWeight: "800",
        marginTop: 3,
        includeFontPadding: false
    },

    summaryText: {
        color: "#444444",
        fontSize: 15,
        lineHeight: 21,
        marginTop: 10,
        includeFontPadding: false
    },

    hcpCard: {
        alignItems: "center",
        backgroundColor: "#F2F7F3",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#D0E0D3",
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 16
    },

    hcpNumber: {
        color: "#173A26",
        fontSize: 30,
        fontWeight: "900",
        includeFontPadding: false
    },

    hcpLabel: {
        color: "#5B6A5E",
        fontSize: 12,
        fontWeight: "700",
        marginTop: 2,
        includeFontPadding: false
    },

    section: {
        marginTop: 20
    },

    sectionTitle: {
        color: "#173A26",
        fontSize: 17,
        fontWeight: "800",
        marginBottom: 8,
        includeFontPadding: false
    },

    entryRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 7
    },

    entryBullet: {
        width: 18,
        color: "#2E7D32",
        fontSize: 16,
        fontWeight: "900",
        lineHeight: 20,
        includeFontPadding: false
    },

    entryText: {
        flex: 1,
        color: "#444444",
        fontSize: 14,
        lineHeight: 20,
        includeFontPadding: false
    }
});