import React from "react";

import {
    StyleSheet,
    Text,
    View
} from "react-native";

import { Game } from "../core/Game";
import { Seat } from "../core/Seat";
import { Trick } from "../play/Trick";

import SeatView from "./SeatView";

import SideDummyHandView
from "./SideDummyHandView";

import TableCenter from "./TableCenter";

interface Props {
    game: Game;

    displayedTrick: Trick;

    showCompletedTrick: boolean;

    completedTrickWinner?: Seat;

    collectingCompletedTrick: boolean;

    dummyVisible: boolean;

    showAllHands: boolean;
}

export default function TablePlayArea({
    game,
    displayedTrick,
    showCompletedTrick,
    completedTrickWinner,
    collectingCompletedTrick,
    dummyVisible,
    showAllHands
}: Props) {
    const westIsDummy =
        game.isDummy(
            Seat.West
        );

    const eastIsDummy =
        game.isDummy(
            Seat.East
        );

    /*
     * A legitimate dummy becomes visible
     * only after the opening lead.
     */
    const showWestDummy =
        dummyVisible &&
        westIsDummy;

    const showEastDummy =
        dummyVisible &&
        eastIsDummy;

    /*
     * Show Hands reveals a concealed
     * East or West hand even when that
     * seat is not dummy.
     */
    const showWestHand =
        showWestDummy ||
        showAllHands;

    const showEastHand =
        showEastDummy ||
        showAllHands;

    const hasSideHand =
        showWestHand ||
        showEastHand;

    const westRole =
        roleForSeat(
            game,
            Seat.West
        );

    const eastRole =
        roleForSeat(
            game,
            Seat.East
        );

    return (
        <View style={styles.middleRow}>
            {/*
             * =====================================
             * WEST
             * =====================================
             */}

            <View
                style={[
                    styles.sideSeat,

                    showWestHand &&
                        styles.dummySideSeat
                ]}
            >
                {showWestHand ? (
                    <SideDummyHandView
                        seat={
                            Seat.West
                        }

                        hand={
                            game.handOf(
                                Seat.West
                            )
                        }

                        active={
                            !showCompletedTrick &&
                            game.currentSeat ===
                                Seat.West
                        }

                        trump={
                            game.contract.trump
                        }

                        title={
                            showWestDummy
                                ? "West — Dummy"
                                : `West — ${westRole}`
                        }
                    />
                ) : (
                    <View
                        style={
                            styles.hiddenSeatArea
                        }
                    >
                        <Text
                            style={[
                                styles.roleLabel,

                                westRole ===
                                    "Declarer" &&
                                    styles
                                        .declarerLabel
                            ]}
                        >
                            {westRole}
                        </Text>

                        <SeatView
                            name="West"

                            cardCount={
                                game.handOf(
                                    Seat.West
                                ).cards.length
                            }

                            orientation=
                                "vertical"

                            active={
                                !showCompletedTrick &&
                                game.currentSeat ===
                                    Seat.West
                            }
                        />
                    </View>
                )}
            </View>

            {/*
             * =====================================
             * CENTER TABLE
             * =====================================
             */}

            <View
                style={[
                    styles.centerArea,

                    hasSideHand &&
                        styles
                            .compactCenterArea
                ]}
            >
                <TableCenter
                    trick={
                        displayedTrick
                    }

                    winnerSeat={
                        showCompletedTrick
                            ? completedTrickWinner
                            : undefined
                    }

                    collecting={
                        collectingCompletedTrick
                    }
                />
            </View>

            {/*
             * =====================================
             * EAST
             * =====================================
             */}

            <View
                style={[
                    styles.sideSeat,

                    showEastHand &&
                        styles.dummySideSeat
                ]}
            >
                {showEastHand ? (
                    <SideDummyHandView
                        seat={
                            Seat.East
                        }

                        hand={
                            game.handOf(
                                Seat.East
                            )
                        }

                        active={
                            !showCompletedTrick &&
                            game.currentSeat ===
                                Seat.East
                        }

                        trump={
                            game.contract.trump
                        }

                        title={
                            showEastDummy
                                ? "East — Dummy"
                                : `East — ${eastRole}`
                        }
                    />
                ) : (
                    <View
                        style={
                            styles.hiddenSeatArea
                        }
                    >
                        <Text
                            style={[
                                styles.roleLabel,

                                eastRole ===
                                    "Declarer" &&
                                    styles
                                        .declarerLabel
                            ]}
                        >
                            {eastRole}
                        </Text>

                        <SeatView
                            name="East"

                            cardCount={
                                game.handOf(
                                    Seat.East
                                ).cards.length
                            }

                            orientation=
                                "vertical"

                            active={
                                !showCompletedTrick &&
                                game.currentSeat ===
                                    Seat.East
                            }
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

function roleForSeat(
    game: Game,
    seat: Seat
): string {
    if (
        game.isDeclarer(
            seat
        )
    ) {
        return "Declarer";
    }

    if (
        game.isDummy(
            seat
        )
    ) {
        return "Dummy";
    }

    return "Defender";
}

const styles = StyleSheet.create({
    middleRow: {
        flex: 1,
        width: "100%",
        minHeight: 185,

        flexDirection: "row",

        alignItems: "center",

        justifyContent:
            "space-between"
    },

    sideSeat: {
        width: 64,

        alignItems: "center",

        justifyContent: "center",

        zIndex: 2
    },

    /*
     * Wider whenever actual cards
     * are displayed.
     */
    dummySideSeat: {
        width: 92
    },

    centerArea: {
        flex: 1,

        alignItems: "center",

        justifyContent: "center",

        paddingHorizontal: 2
    },

    /*
     * Important:
     *
     * Do NOT scale TableCenter here.
     *
     * Scaling TableCenter was what made
     * the played cards too small earlier.
     */
    compactCenterArea: {
        minWidth: 150,

        paddingHorizontal: 0
    },

    hiddenSeatArea: {
        alignItems: "center",

        justifyContent: "center"
    },

    roleLabel: {
        color: "#E8F5E9",

        fontSize: 10,

        fontWeight: "800",

        textAlign: "center",

        marginBottom: 3,

        includeFontPadding: false
    },

    declarerLabel: {
        color: "#FFEB3B"
    }
});