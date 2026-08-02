import React, {
    useEffect,
    useReducer,
    useState
} from "react";

import {
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

import AuctionHistoryView from "./AuctionHistoryView";

import {
    Deal,
    DealResult
} from "../core/Deal";

import {
    Seat,
    nextSeat
} from "../core/Seat";

import { Game } from "../core/Game";

import BiddingBox from "./BiddingBox";
import BridgeScreen from "./BridgeScreen";
import HandView from "./HandView";

const COMPUTER_BID_DELAY_MS = 650;

type SessionPhase =
    | "auction"
    | "play"
    | "passedOut";

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
                    auction.isComplete() ||
                    auction.currentSeat ===
                        Seat.South
                ) {
                    return;
                }

                const bidder =
                    auction.currentSeat;

                const bid =
                    BiddingAI.chooseBid(
                        hands[bidder],
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
         * Opening lead is made by the player
         * immediately to declarer's left.
         */
        const openingLeader =
            nextSeat(
                contract.declarer
            );

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

    if (
        phase === "play" &&
        game
    ) {
        return (
            <BridgeScreen
                key={game.contract.toString()}
                initialGame={game}
                onNewBoard={startNewBoard}
            />
        );
    }

    if (phase === "passedOut") {
        return (
            <SafeAreaView
                style={styles.safeArea}
            >
                <View style={styles.resultPanel}>
                    <Text style={styles.resultTitle}>
                        Passed Out
                    </Text>

                    <Text
                        onPress={startNewBoard}
                        style={styles.newBoardButton}
                    >
                        New Board
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const southMayBid =
        auction.currentSeat ===
            Seat.South &&
        !auction.isComplete();

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
            <View style={styles.container}>
                <Text style={styles.title}>
                    BridgeAI
                </Text>

                <Text style={styles.subtitle}>
                    Dealer: {auction.dealer}
                </Text>

<AuctionHistoryView
    auction={auction}
/>
                <View style={styles.handArea}>
                    <Text style={styles.handTitle}>
                        South — You
                    </Text>

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
                    onBid={makeSouthBid}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#145A32"
    },

    container: {
        flex: 1,
        backgroundColor: "#1B7040",
        paddingHorizontal: 10,
        paddingVertical: 8
    },

    title: {
        color: "#FFFFFF",
        fontSize: 27,
        fontWeight: "800"
    },

    subtitle: {
        color: "#E8F5E9",
        fontSize: 15,
        marginBottom: 8
    },

    handArea: {
        alignItems: "center",
        marginVertical: 8
    },

    handTitle: {
        width: "100%",
        maxWidth: 350,
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "800",
        marginBottom: 3
    },

    turnText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 7
    },

    yourTurnText: {
        color: "#FFEB3B"
    },

    resultPanel: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1B7040"
    },

    resultTitle: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "800"
    },


    newBoardButton: {
        backgroundColor: "#FFEB3B",
        borderRadius: 10,
        color: "#1B1B1B",
        fontSize: 17,
        fontWeight: "800",
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginTop: 20,
        overflow: "hidden"
    }
});