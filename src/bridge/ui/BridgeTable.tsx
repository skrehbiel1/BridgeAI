import React, {
    useEffect,
    useReducer,
    useState
} from "react";

import {
    Pressable,
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
const COMPLETED_TRICK_DELAY_MS = 1000;

function createGame(): Game {
    return new Game(
        new Contract(
            4,
            Suit.Spades,
            Seat.South
        ),
        Seat.West
    );
}

export default function BridgeTable() {
    /*
     * Game mutates its internal state.
     * Incrementing renderVersion forces React
     * to redraw after each successful play.
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
        game,
        setGame
    ] = useState<Game>(
        createGame
    );

    /*
     * True while the four completed cards remain
     * visible in the center of the table.
     */
    const [
        showCompletedTrick,
        setShowCompletedTrick
    ] = useState(false);

    /*
     * Play one computer card at a time.
     */
    useEffect(() => {
        if (
            showCompletedTrick ||
            game.isFinished() ||
            game.currentSeat === Seat.South
        ) {
            return;
        }

        const timer = setTimeout(() => {
            /*
             * Check again because the state may
             * have changed while the timer waited.
             */
            if (
                showCompletedTrick ||
                game.isFinished() ||
                game.currentSeat === Seat.South
            ) {
                return;
            }

            const tricksBefore =
                game.table.totalTricks();

            const played =
                game.playComputerTurn();

            if (!played) {
                return;
            }

            const trickCompleted =
                game.table.totalTricks() >
                tricksBefore;

            if (trickCompleted) {
                setShowCompletedTrick(true);
            }

            redraw();
        }, COMPUTER_PLAY_DELAY_MS);

        return () => {
            clearTimeout(timer);
        };
    }, [
        game,
        renderVersion,
        showCompletedTrick
    ]);

    /*
     * Keep all four cards visible briefly after
     * the trick has been completed.
     */
    useEffect(() => {
        if (!showCompletedTrick) {
            return;
        }

        const timer = setTimeout(() => {
            setShowCompletedTrick(false);
            redraw();
        }, COMPLETED_TRICK_DELAY_MS);

        return () => {
            clearTimeout(timer);
        };
    }, [showCompletedTrick]);

    function playSouthCard(
        index: number
    ): void {
        if (
            showCompletedTrick ||
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

        const tricksBefore =
            game.table.totalTricks();

        const played =
            game.playCard(
                Seat.South,
                card
            );

        if (!played) {
            return;
        }

        const trickCompleted =
            game.table.totalTricks() >
            tricksBefore;

        if (trickCompleted) {
            setShowCompletedTrick(true);
        }

        redraw();
    }

    function restartGame(): void {
        setShowCompletedTrick(false);
        setGame(createGame());
    }

    /*
     * Game.finishTrick() clears currentTrick.
     * While pausing, display the saved completed
     * trick instead.
     */
    const displayedTrick =
        showCompletedTrick &&
        game.lastCompletedTrick
            ? game.lastCompletedTrick
            : game.table.currentTrick;

    /*
     * Legal-card highlighting must use the real
     * current trick, not the saved completed one.
     */
    const activeLeadSuit =
        game.table.currentTrick.leadSuit;

    const southHand =
        game.handOf(Seat.South);

    const southCanPlay =
        !showCompletedTrick &&
        !game.isFinished() &&
        game.currentSeat === Seat.South;

    const statusMessage =
        getStatusMessage(
            game,
            southCanPlay,
            showCompletedTrick
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

                    <View style={styles.rightHeader}>
                        <View style={styles.scorePanel}>
                            <Text style={styles.scoreText}>
                                NS {game.table.nsTricks}
                            </Text>

                            <Text style={styles.scoreText}>
                                EW {game.table.ewTricks}
                            </Text>
                        </View>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Deal a new bridge hand"
                            onPress={restartGame}
                            style={({ pressed }) => [
                                styles.newHandButton,
                                pressed &&
                                    styles.newHandButtonPressed
                            ]}
                        >
                            <Text
                                style={
                                    styles.newHandButtonText
                                }
                            >
                                New Hand
                            </Text>
                        </Pressable>
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
                            !showCompletedTrick &&
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
                                !showCompletedTrick &&
                                game.currentSeat ===
                                    Seat.West
                            }
                        />
                    </View>

                    <View style={styles.centerArea}>
                        <TableCenter
                            trick={displayedTrick}
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
                                !showCompletedTrick &&
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
                        leadSuit={activeLeadSuit}
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
    southCanPlay: boolean,
    showCompletedTrick: boolean
): string {
    if (showCompletedTrick) {
        return "Trick complete";
    }

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

    rightHeader: {
        minWidth: 94,
        alignItems: "stretch"
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

    newHandButton: {
        minHeight: 40,
        marginTop: 7,
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#FFF176",
        backgroundColor: "#FFEB3B",
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        shadowColor: "#000000",
        shadowOpacity: 0.28,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 3
        }
    },

    newHandButtonPressed: {
        backgroundColor: "#FDD835",
        borderColor: "#F9A825",
        opacity: 0.9,
        transform: [
            {
                scale: 0.97
            }
        ]
    },

    newHandButtonText: {
        color: "#1B1B1B",
        fontSize: 15,
        fontWeight: "800",
        lineHeight: 19,
        includeFontPadding: false,
        textAlign: "center"
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