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

import { Game } from "../core/Game";
import { Seat } from "../core/Seat";
import { Suit } from "../cards/Card";
import { Contract } from "../play/Contract";

import HandView from "./HandView";
import SeatView from "./SeatView";
import TableCenter from "./TableCenter";

const COMPUTER_PLAY_DELAY_MS = 650;

export default function BridgeTable() {
    /*
     * Game mutates its own state, so renderVersion
     * forces React to redraw after each successful play.
     */
    const [renderVersion, redraw] =
        useReducer(
            (version: number) =>
                version + 1,
            0
        );

    const [game] = useState(
        () =>
            new Game(
                new Contract(
                    4,
                    Suit.Spades,
                    Seat.South
                ),
                Seat.West
            )
    );

    /*
     * Play one computer card at a time.
     *
     * The second turn check inside the timer prevents
     * a delayed computer action from attempting to play
     * after control has already reached South.
     */
    useEffect(() => {
        if (
            game.isFinished() ||
            game.currentSeat === Seat.South
        ) {
            return;
        }

        const timer = setTimeout(() => {
            if (
                game.isFinished() ||
                game.currentSeat === Seat.South
            ) {
                return;
            }

            const played =
                game.playComputerTurn();

            if (played) {
                redraw();
            }
        }, COMPUTER_PLAY_DELAY_MS);

        return () => {
            clearTimeout(timer);
        };
    }, [game, renderVersion]);

    function playSouthCard(
        index: number
    ): void {
        if (
            game.isFinished() ||
            game.currentSeat !== Seat.South
        ) {
            return;
        }

        const southHand =
            game.handOf(Seat.South);

        const card =
            southHand.cards[index];

        if (!card) {
            return;
        }

        const played =
            game.playCard(
                Seat.South,
                card
            );

        if (played) {
            redraw();
        }
    }

    const currentTrick =
        game.table.currentTrick;

    const southHand =
        game.handOf(Seat.South);

    const southCanPlay =
        !game.isFinished() &&
        game.currentSeat === Seat.South;

    const statusMessage =
        getStatusMessage(
            game,
            southCanPlay
        );

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
                <View style={styles.headerRow}>
                    <View style={styles.titleArea}>
                        <Text style={styles.title}>
                            BridgeAI
                        </Text>

                        <Text style={styles.contract}>
                            Contract: 4♠ by South
                        </Text>
                    </View>

                    <View style={styles.scorePanel}>
                        <Text style={styles.scoreText}>
                            NS {game.table.nsTricks}
                        </Text>

                        <Text style={styles.scoreText}>
                            EW {game.table.ewTricks}
                        </Text>
                    </View>
                </View>

                <View style={styles.northRow}>
                    <SeatView
                        name="North"
                        cardCount={
                            game.handOf(
                                Seat.North
                            ).cards.length
                        }
                        orientation="horizontal"
                        active={
                            game.currentSeat ===
                            Seat.North
                        }
                    />
                </View>

                <View style={styles.middleRow}>
                    <View style={styles.sideSeat}>
                        <SeatView
                            name="West"
                            cardCount={
                                game.handOf(
                                    Seat.West
                                ).cards.length
                            }
                            orientation="vertical"
                            active={
                                game.currentSeat ===
                                Seat.West
                            }
                        />
                    </View>

                    <View style={styles.centerArea}>
                        <TableCenter
                            trick={currentTrick}
                        />
                    </View>

                    <View style={styles.sideSeat}>
                        <SeatView
                            name="East"
                            cardCount={
                                game.handOf(
                                    Seat.East
                                ).cards.length
                            }
                            orientation="vertical"
                            active={
                                game.currentSeat ===
                                Seat.East
                            }
                        />
                    </View>
                </View>

                <View style={styles.southArea}>
                    <View style={styles.southHeading}>
                        <Text style={styles.southTitle}>
                            South — You
                        </Text>

                        <Text style={styles.cardCount}>
                            {southHand.cards.length} cards
                        </Text>
                    </View>

                    <Text
                        style={[
                            styles.statusMessage,
                            southCanPlay &&
                                styles.yourTurnMessage
                        ]}
                    >
                        {statusMessage}
                    </Text>

                    <HandView
                        hand={southHand}
                        leadSuit={
                            currentTrick.leadSuit
                        }
                        enabled={southCanPlay}
                        onCardPlayed={
                            playSouthCard
                        }
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

function getStatusMessage(
    game: Game,
    southCanPlay: boolean
): string {
    if (game.isFinished()) {
        const tricks =
            game.tricksWon();

        return (
            `Hand complete — ` +
            `NS ${tricks.NS}, ` +
            `EW ${tricks.EW}`
        );
    }

    if (southCanPlay) {
        return (
            "Your turn — choose a highlighted card"
        );
    }

    return `${game.currentSeat} is playing`;
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#145A32"
    },

    container: {
        flex: 1,
        backgroundColor: "#1B7040",
        paddingTop: 6,
        paddingHorizontal: 8,
        paddingBottom: 8
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingHorizontal: 6
    },

    titleArea: {
        flex: 1,
        paddingRight: 12
    },

    title: {
        color: "#FFFFFF",
        fontSize: 26,
        fontWeight: "700",
        lineHeight: 31,
        includeFontPadding: false
    },

    contract: {
        color: "#E8F5E9",
        fontSize: 14,
        marginTop: 1,
        includeFontPadding: false
    },

    scorePanel: {
        minWidth: 68,
        borderRadius: 9,
        backgroundColor:
            "rgba(0, 0, 0, 0.23)",
        paddingHorizontal: 12,
        paddingVertical: 6
    },

    scoreText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
        lineHeight: 20,
        textAlign: "right",
        includeFontPadding: false
    },

    northRow: {
        height: 94,
        alignItems: "center",
        justifyContent: "center"
    },

    middleRow: {
        flex: 1,
        width: "100%",
        minHeight: 215,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    sideSeat: {
        width: 72,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2
    },

    centerArea: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 2
    },

    southArea: {
        width: "100%",
        alignItems: "center",
        paddingTop: 4,
        paddingBottom: 4
    },

    southHeading: {
        width: "100%",
        maxWidth: 340,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 3,
        marginBottom: 2
    },

    southTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        lineHeight: 23,
        includeFontPadding: false
    },

    cardCount: {
        color: "#E8F5E9",
        fontSize: 13,
        includeFontPadding: false
    },

    statusMessage: {
        minHeight: 20,
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 19,
        textAlign: "center",
        marginBottom: 6,
        includeFontPadding: false
    },

    yourTurnMessage: {
        color: "#FFEB3B"
    }
});