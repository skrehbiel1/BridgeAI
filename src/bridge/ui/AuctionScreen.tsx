import React, {
    useEffect,
    useReducer,
    useState
} from "react";

import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    SafeAreaView
} from "react-native-safe-area-context";

import {
    Suit
} from "../cards/Card";

import {
    suitSymbol
} from "../cards/SuitDisplay";

import {
    Deal,
    DealResult
} from "../core/Deal";

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

import {
    BiddingAI
} from "../auction/BiddingAI";

import BiddingBox from "./BiddingBox";
import HandView from "./HandView";

const COMPUTER_BID_DELAY_MS = 650;

function createAuction(): Auction {
    return new Auction(
        Seat.North
    );
}

function createDeal(): DealResult {
    return Deal.create();
}

export default function AuctionScreen() {
    /*
     * Auction and Hand are mutable classes.
     * Incrementing renderVersion forces a redraw.
     */
    const [
        renderVersion,
        redraw
    ] = useReducer(
        (version: number) =>
            version + 1,
        0
    );

    const [
        auction,
        setAuction
    ] = useState<Auction>(
        createAuction
    );

    const [
        hands,
        setHands
    ] = useState<DealResult>(
        createDeal
    );

    /*
     * North, East, and West bid automatically.
     * South is controlled by the user.
     */
    useEffect(() => {
        if (
            auction.isComplete() ||
            auction.currentSeat === Seat.South
        ) {
            return;
        }

        const timer = setTimeout(() => {
            if (
                auction.isComplete() ||
                auction.currentSeat === Seat.South
            ) {
                return;
            }

            const bidder =
                auction.currentSeat;

            const hand =
                hands[bidder];

            const bid =
                BiddingAI.chooseBid(
                    hand,
                    auction
                );

            const accepted =
                auction.addBid(bid);

            if (accepted) {
                redraw();
            }
        }, COMPUTER_BID_DELAY_MS);

        return () => {
            clearTimeout(timer);
        };
    }, [
        auction,
        hands,
        renderVersion
    ]);

    function makeSouthBid(
        bid: Bid
    ): void {
        if (
            auction.isComplete() ||
            auction.currentSeat !== Seat.South
        ) {
            return;
        }

        const accepted =
            auction.addBid(bid);

        if (accepted) {
            redraw();
        }
    }

    function startNewAuction(): void {
        setHands(
            createDeal()
        );

        setAuction(
            createAuction()
        );
    }

    const southHand =
        hands[Seat.South];

    const southMayBid =
        !auction.isComplete() &&
        auction.currentSeat === Seat.South;

    const finalContract =
        auction.finalContract();

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={[
                "top",
                "right",
                "bottom",
                "left"
            ]}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={
                    styles.content
                }
            >
                <View style={styles.header}>
                    <Text style={styles.title}>
                        BridgeAI
                    </Text>

                    <Text style={styles.subtitle}>
                        Auction
                    </Text>
                </View>

                <View style={styles.statusPanel}>
                    <Text style={styles.statusLabel}>
                        Dealer
                    </Text>

                    <Text style={styles.statusValue}>
                        {auction.dealer}
                    </Text>

                    <Text style={styles.statusLabel}>
                        Current bidder
                    </Text>

                    <Text style={styles.statusValue}>
                        {auction.isComplete()
                            ? "Auction complete"
                            : auction.currentSeat}
                    </Text>
                </View>

                <AuctionHistory
                    auction={auction}
                />

                {auction.isComplete() ? (
                    <AuctionResult
                        auction={auction}
                        onNewAuction={
                            startNewAuction
                        }
                    />
                ) : (
                    <>
                        <View style={styles.handArea}>
                            <View style={styles.handHeading}>
                                <Text style={styles.handTitle}>
                                    South — You
                                </Text>

                                <Text style={styles.handCount}>
                                    {
                                        southHand.cards
                                            .length
                                    }{" "}
                                    cards
                                </Text>
                            </View>

                            <HandView
                                hand={southHand}
                                enabled={false}
                            />
                        </View>

                        <Text
                            style={[
                                styles.turnMessage,
                                southMayBid &&
                                    styles.yourTurn
                            ]}
                        >
                            {southMayBid
                                ? "Your turn to bid"
                                : `${auction.currentSeat} is bidding`}
                        </Text>

                        <BiddingBox
                            auction={auction}
                            disabled={
                                !southMayBid
                            }
                            onBid={
                                makeSouthBid
                            }
                        />
                    </>
                )}

                {finalContract && (
                    <Text style={styles.contractPreview}>
                        Final contract:{" "}
                        {formatBid(
                            Bid.Contract(
                                finalContract.level,
                                finalContract.trump
                            )
                        )}{" "}
                        by {finalContract.declarer}
                    </Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

function AuctionHistory({
    auction
}: {
    auction: Auction;
}) {
    return (
        <View style={styles.historyPanel}>
            <Text style={styles.historyTitle}>
                Auction History
            </Text>

            <View style={styles.historyHeader}>
                {[
                    Seat.North,
                    Seat.East,
                    Seat.South,
                    Seat.West
                ].map(seat => (
                    <Text
                        key={seat}
                        style={styles.seatHeader}
                    >
                        {seat}
                    </Text>
                ))}
            </View>

            {auction.calls.length === 0 ? (
                <Text style={styles.emptyHistory}>
                    No calls yet
                </Text>
            ) : (
                <View style={styles.callGrid}>
                    {auction.calls.map(
                        (
                            call,
                            index
                        ) => (
                            <View
                                key={index}
                                style={
                                    styles.callCell
                                }
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

                                <Text style={styles.callSeat}>
                                    {call.seat}
                                </Text>
                            </View>
                        )
                    )}
                </View>
            )}
        </View>
    );
}

function AuctionResult({
    auction,
    onNewAuction
}: {
    auction: Auction;
    onNewAuction: () => void;
}) {
    const contract =
        auction.finalContract();

    return (
        <View style={styles.resultPanel}>
            <Text style={styles.resultTitle}>
                Auction Complete
            </Text>

            {auction.isPassedOut() ? (
                <Text style={styles.passedOut}>
                    Passed out
                </Text>
            ) : contract ? (
                <>
                    <Text style={styles.finalContract}>
                        {formatBid(
                            Bid.Contract(
                                contract.level,
                                contract.trump
                            )
                        )}
                    </Text>

                    <Text style={styles.declarer}>
                        Declarer:{" "}
                        {contract.declarer}
                    </Text>
                </>
            ) : (
                <Text style={styles.passedOut}>
                    No contract
                </Text>
            )}

            <Text
                accessibilityRole="button"
                onPress={onNewAuction}
                style={styles.newAuctionButton}
            >
                New Auction
            </Text>
        </View>
    );
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

    return suitSymbol(suit);
}

function bidColor(
    bid: Bid
): string {
    if (bid.isPass()) {
        return "#555555";
    }

    if (
        bid.suit === Suit.Hearts ||
        bid.suit === Suit.Diamonds
    ) {
        return "#C62828";
    }

    return "#151515";
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#145A32"
    },

    scrollView: {
        flex: 1,
        backgroundColor: "#1B7040"
    },

    content: {
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom: 30
    },

    header: {
        marginBottom: 8
    },

    title: {
        color: "#FFFFFF",
        fontSize: 27,
        fontWeight: "800",
        includeFontPadding: false
    },

    subtitle: {
        color: "#E8F5E9",
        fontSize: 16,
        fontWeight: "600",
        marginTop: 2,
        includeFontPadding: false
    },

    statusPanel: {
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor:
            "rgba(0,0,0,0.22)",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 10
    },

    statusLabel: {
        color: "#C8E6C9",
        fontSize: 13,
        fontWeight: "600",
        marginRight: 5
    },

    statusValue: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "800",
        marginRight: 18
    },

    historyPanel: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 10,
        marginBottom: 10
    },

    historyTitle: {
        color: "#173A26",
        fontSize: 18,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 8
    },

    historyHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#DDDDDD",
        paddingBottom: 5
    },

    seatHeader: {
        flex: 1,
        color: "#444444",
        fontSize: 12,
        fontWeight: "800",
        textAlign: "center"
    },

    callGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingTop: 6
    },

    callCell: {
        width: "25%",
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE"
    },

    callText: {
        fontSize: 18,
        fontWeight: "800"
    },

    callSeat: {
        color: "#999999",
        fontSize: 9,
        marginTop: 1
    },

    emptyHistory: {
        color: "#888888",
        textAlign: "center",
        paddingVertical: 14
    },

    handArea: {
        width: "100%",
        alignItems: "center",
        marginBottom: 7
    },

    handHeading: {
        width: "100%",
        maxWidth: 350,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
        marginBottom: 3
    },

    handTitle: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "800"
    },

    handCount: {
        color: "#E8F5E9",
        fontSize: 13
    },

    turnMessage: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 7
    },

    yourTurn: {
        color: "#FFEB3B"
    },

    resultPanel: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 22
    },

    resultTitle: {
        color: "#173A26",
        fontSize: 23,
        fontWeight: "800"
    },

    finalContract: {
        color: "#151515",
        fontSize: 36,
        fontWeight: "900",
        marginTop: 14
    },

    declarer: {
        color: "#444444",
        fontSize: 17,
        fontWeight: "700",
        marginTop: 5
    },

    passedOut: {
        color: "#555555",
        fontSize: 23,
        fontWeight: "800",
        marginTop: 14
    },

    newAuctionButton: {
        minWidth: 160,
        backgroundColor: "#FFEB3B",
        borderWidth: 2,
        borderColor: "#F9A825",
        borderRadius: 10,
        color: "#1B1B1B",
        fontSize: 16,
        fontWeight: "800",
        textAlign: "center",
        paddingHorizontal: 18,
        paddingVertical: 11,
        marginTop: 20,
        overflow: "hidden"
    },

    contractPreview: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 10
    }
});