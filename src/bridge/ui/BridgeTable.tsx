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

import TableHeader from "./TableHeader";

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

    const [
        renderVersion,
        redraw
    ] = useReducer(
        (x: number) => x + 1,
        0
    );

    const [
        game,
        setGame
    ] = useState<Game>(
        createGame
    );

    const [
        showCompletedTrick,
        setShowCompletedTrick
    ] = useState(false);

    const dummyVisible =
        game.openingLeadMade;

    useEffect(() => {

        if (
            showCompletedTrick ||
            game.isFinished() ||
            game.isHumanControlled(
                game.currentSeat
            )
        ) {
            return;
        }

        const timer =
            setTimeout(() => {

                if (
                    showCompletedTrick ||
                    game.isFinished() ||
                    game.isHumanControlled(
                        game.currentSeat
                    )
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

                if (
                    game.table.totalTricks() >
                    tricksBefore
                ) {
                    setShowCompletedTrick(
                        true
                    );
                }

                redraw();

            }, COMPUTER_PLAY_DELAY_MS);

        return () =>
            clearTimeout(timer);

    }, [
        game,
        renderVersion,
        showCompletedTrick
    ]);

    useEffect(() => {

        if (
            !showCompletedTrick
        ) {
            return;
        }

        const timer =
            setTimeout(() => {

                setShowCompletedTrick(
                    false
                );

                redraw();

            },
            COMPLETED_TRICK_DELAY_MS);

        return () =>
            clearTimeout(timer);

    }, [
        showCompletedTrick
    ]);

    function playHumanCard(

        seat: Seat,

        index: number

    ) {

        if (
            showCompletedTrick ||
            game.currentSeat !== seat
        ) {
            return;
        }

        const hand =
            game.handOf(seat);

        const card =
            hand.cards[index];

        if (!card) {
            return;
        }

        const tricksBefore =
            game.table.totalTricks();

        const played =
            game.playCard(
                seat,
                card
            );

        if (!played) {
            return;
        }

        if (
            game.table.totalTricks() >
            tricksBefore
        ) {
            setShowCompletedTrick(
                true
            );
        }

        redraw();

    }

    function restartGame() {

        setShowCompletedTrick(
            false
        );

        setGame(
            createGame()
        );

    }

    const displayedTrick =

        showCompletedTrick &&

        game.lastCompletedTrick

            ? game.lastCompletedTrick

            : game.table.currentTrick;

    const activeLeadSuit =
        game.table.currentTrick
            .leadSuit;

    const southCanPlay =

        !showCompletedTrick &&

        game.currentSeat ===
        Seat.South;

    const northCanPlay =

        dummyVisible &&

        !showCompletedTrick &&

        game.currentSeat ===
        Seat.North;

    const statusMessage =
        getStatusMessage(

            game,

            southCanPlay,

            northCanPlay,

            showCompletedTrick

        );

    const southHand =
        game.handOf(
            Seat.South
        );

    const northHand =
        game.handOf(
            Seat.North
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
<TableHeader
    nsTricks={game.table.nsTricks}
    ewTricks={game.table.ewTricks}
    onNewHand={restartGame}
/>

<View style={styles.northRow}>

    {
        dummyVisible

        ?

        <View style={styles.dummyArea}>

            <View style={styles.dummyHeading}>

                <Text style={styles.dummyTitle}>
                    North (Dummy)
                </Text>

                <Text style={styles.dummyCount}>
                    {northHand.cards.length} cards
                </Text>

            </View>

            <HandView

                hand={northHand}

                leadSuit={activeLeadSuit}

                enabled={northCanPlay}

                onCardPlayed={
                    index =>
                        playHumanCard(
                            Seat.North,
                            index
                        )
                }

            />

        </View>

        :

        <SeatView

            name="North"

            cardCount={
                northHand.cards.length
            }

            orientation="horizontal"

            active={false}

        />

    }

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
    index =>
        playHumanCard(
            Seat.South,
            index
        )
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
    northCanPlay: boolean,
    showCompletedTrick: boolean
): string {
    if (showCompletedTrick) {
        return "Trick complete";
    }

    if (game.isFinished()) {
        const tricks = game.tricksWon();

        return (
            `Hand complete — ` +
            `NS ${tricks.NS}, ` +
            `EW ${tricks.EW}`
        );
    }

    if (southCanPlay) {
        return "Your turn — play from South";
    }

    if (northCanPlay) {
        return "Your turn — play from dummy";
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


northRow: {

    minHeight: 135,
    paddingVertical: 4,
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
dummyArea: {

    width: "100%",

    maxWidth: 350,

    alignItems: "center"

},

dummyHeading: {

    width: "100%",

    flexDirection: "row",

    justifyContent: "space-between",

    paddingHorizontal: 4,

    marginBottom: 2

},

dummyTitle: {

    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "700"

},

dummyCount: {

    color: "#E8F5E9",

    fontSize: 12

},

    yourTurnMessage: {
        color: "#FFEB3B"
    }
});