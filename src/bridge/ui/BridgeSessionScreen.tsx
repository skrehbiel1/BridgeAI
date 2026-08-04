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

import { Auction } from "../auction/Auction";
import { Bid } from "../auction/Bid";
import { BiddingAI } from "../auction/BiddingAI";

import {
    Deal,
    DealResult
} from "../core/Deal";

import { Seat } from "../core/Seat";

import {
    openingLeaderForContract
} from "../core/ContractSeats";

import { Game } from "../core/Game";

import AuctionHistoryView from "./AuctionHistoryView";
import BiddingBox from "./BiddingBox";
import BridgeScreen from "./BridgeScreen";
import HandView from "./HandView";

const COMPUTER_BID_DELAY_MS = 650;

type SessionPhase =
    | "auction"
    | "play"
    | "passedOut"
    | "unsupportedContract";

interface SessionState {
    hands: DealResult;
    auction: Auction;
    game?: Game;
    phase: SessionPhase;
}

function createSession(): SessionState {
    return {
        hands: Deal.create(),

        auction:
            new Auction(
                Seat.North
            ),

        phase: "auction"
    };
}

export default function BridgeSessionScreen() {
    /*
     * Auction and hand objects are mutable.
     * Incrementing renderVersion forces React
     * to render their updated state.
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
        session,
        setSession
    ] = useState<SessionState>(
        createSession
    );

    const {
        auction,
        hands,
        game,
        phase
    } = session;

    /*
     * North, East and West bid automatically.
     * South is controlled by the user.
     */
    useEffect(() => {
        if (
            phase !== "auction" ||
            auction.isComplete() ||
            auction.currentSeat ===
                Seat.South
        ) {
            return;
        }

        const timer =
            setTimeout(() => {
                if (
                    phase !== "auction" ||
                    auction.isComplete() ||
                    auction.currentSeat ===
                        Seat.South
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

                if (!accepted) {
                    return;
                }

                finishAuctionIfNeeded();

                redraw();
            }, COMPUTER_BID_DELAY_MS);

        return () => {
            clearTimeout(timer);
        };
    }, [
        auction,
        hands,
        phase,
        renderVersion
    ]);

    function makeSouthBid(
        bid: Bid
    ): void {
        if (
            phase !== "auction" ||
            auction.currentSeat !==
                Seat.South ||
            auction.isComplete()
        ) {
            return;
        }

        const accepted =
            auction.addBid(bid);

        if (!accepted) {
            return;
        }

        finishAuctionIfNeeded();

        redraw();
    }

    function finishAuctionIfNeeded():
        void {
        if (!auction.isComplete()) {
            return;
        }

        if (auction.isPassedOut()) {
            setSession(current => ({
                ...current,
                phase: "passedOut"
            }));

            return;
        }

        const contract =
            auction.finalContract();

        if (!contract) {
            return;
        }

        /*
         * The current play UI assumes the human
         * controls the North-South partnership.
         *
         * East-West declarer play will be added
         * after the play screen becomes fully
         * contract-aware.
         */
        const humanSideWonContract =
            contract.declarer ===
                Seat.North ||
            contract.declarer ===
                Seat.South;

        if (!humanSideWonContract) {
            setSession(current => ({
                ...current,
                phase:
                    "unsupportedContract"
            }));

            return;
        }

        /*
         * The opening lead is made by the player
         * immediately to declarer's left.
         */
        const openingLeader =
            openingLeaderForContract(
                contract
            );

        /*
         * Use the same four hands that were shown
         * and evaluated during the auction.
         */
        const preparedGame =
            new Game(
                contract,
                openingLeader,
                hands
            );

        setSession(current => ({
            ...current,
            game: preparedGame,
            phase: "play"
        }));
    }

    function startNewBoard(): void {
        setSession(
            createSession()
        );
    }

    /*
     * Play phase.
     */
    if (
        phase === "play" &&
        game
    ) {
        return (
            <BridgeScreen
                key={
                    game.contract.toString()
                }
                initialGame={game}
                onNewBoard={
                    startNewBoard
                }
            />
        );
    }

    /*
     * Passed-out board.
     */
    if (phase === "passedOut") {
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
                <View
                    style={
                        styles.resultPanel
                    }
                >
                    <Text
                        style={
                            styles.resultTitle
                        }
                    >
                        Passed Out
                    </Text>

                    <Text
                        style={
                            styles.resultMessage
                        }
                    >
                        All four players passed.
                    </Text>

                    <Text
                        accessibilityRole="button"
                        onPress={
                            startNewBoard
                        }
                        style={
                            styles.newBoardButton
                        }
                    >
                        New Board
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    /*
     * Temporary result when East-West wins the
     * auction. Defender play will be added later.
     */
    if (
        phase ===
        "unsupportedContract"
    ) {
        const contract =
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
                <View
                    style={
                        styles.resultPanel
                    }
                >
                    <Text
                        style={
                            styles.resultTitle
                        }
                    >
                        East–West Won the Auction
                    </Text>

                    {contract && (
                        <Text
                            style={
                                styles.resultSubtitle
                            }
                        >
                            Contract:{" "}
                            {
                                contract.toString()
                            }{" "}
                            by{" "}
                            {
                                contract.declarer
                            }
                        </Text>
                    )}

                    <Text
                        style={
                            styles.resultMessage
                        }
                    >
                        Defender play will be
                        added next.
                    </Text>

                    <Text
                        accessibilityRole="button"
                        onPress={
                            startNewBoard
                        }
                        style={
                            styles.newBoardButton
                        }
                    >
                        New Board
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const southMayBid =
        phase === "auction" &&
        !auction.isComplete() &&
        auction.currentSeat ===
            Seat.South;

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
                    styles.container
                }
                showsVerticalScrollIndicator={
                    false
                }
                keyboardShouldPersistTaps={
                    "handled"
                }
            >
                <Text style={styles.title}>
                    BridgeAI
                </Text>

                <Text style={styles.subtitle}>
                    Dealer: {auction.dealer} — OTA TEST
                </Text>

                <AuctionHistoryView
                    auction={auction}
                />

                <View style={styles.handArea}>
                    <View
                        style={
                            styles.handHeading
                        }
                    >
                        <Text
                            style={
                                styles.handTitle
                            }
                        >
                            South — You
                        </Text>

                        <Text
                            style={
                                styles.handCount
                            }
                        >
                            {
                                hands[
                                    Seat.South
                                ].cards.length
                            }{" "}
                            cards
                        </Text>
                    </View>

                    <HandView
                        hand={
                            hands[
                                Seat.South
                            ]
                        }
                        enabled={false}
                    />
                </View>

                <Text
                    style={[
                        styles.turnText,
                        southMayBid &&
                            styles.yourTurnText
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
            </ScrollView>
        </SafeAreaView>
    );
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

    container: {
        flexGrow: 1,
        backgroundColor: "#1B7040",
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom: 28
    },

    title: {
        color: "#FFFFFF",
        fontSize: 27,
        fontWeight: "800",
        includeFontPadding: false
    },

    subtitle: {
        color: "#E8F5E9",
        fontSize: 15,
        fontWeight: "600",
        marginTop: 2,
        marginBottom: 8,
        includeFontPadding: false
    },

    handArea: {
        width: "100%",
        alignItems: "center",
        marginVertical: 8
    },

    handHeading: {
        width: "100%",
        maxWidth: 350,
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
        paddingHorizontal: 4,
        marginBottom: 3
    },

    handTitle: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "800",
        includeFontPadding: false
    },

    handCount: {
        color: "#E8F5E9",
        fontSize: 13,
        includeFontPadding: false
    },

    turnText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 7,
        includeFontPadding: false
    },

    yourTurnText: {
        color: "#FFEB3B"
    },

    resultPanel: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1B7040",
        paddingHorizontal: 24
    },

    resultTitle: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "800",
        textAlign: "center",
        includeFontPadding: false
    },

    resultSubtitle: {
        color: "#FFFFFF",
        fontSize: 19,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 12,
        includeFontPadding: false
    },

    resultMessage: {
        color: "#E8F5E9",
        fontSize: 15,
        textAlign: "center",
        marginTop: 10,
        includeFontPadding: false
    },

    newBoardButton: {
        minWidth: 170,
        backgroundColor: "#FFEB3B",
        borderWidth: 2,
        borderColor: "#F9A825",
        borderRadius: 10,
        color: "#1B1B1B",
        fontSize: 17,
        fontWeight: "800",
        textAlign: "center",
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginTop: 20,
        overflow: "hidden"
    }
});