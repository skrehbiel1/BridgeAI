import React from "react";

import {
    StyleSheet,
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
}

export default function TablePlayArea({
    game,
    displayedTrick,
    showCompletedTrick,
    completedTrickWinner,
    collectingCompletedTrick,
    dummyVisible
}: Props) {
    const westIsDummy =
        game.isDummy(
            Seat.West
        );

    const eastIsDummy =
        game.isDummy(
            Seat.East
        );

    const showWestDummy =
        dummyVisible &&
        westIsDummy;

    const showEastDummy =
        dummyVisible &&
        eastIsDummy;

    const hasSideDummy =
        showWestDummy ||
        showEastDummy;

    return (
        <View style={styles.middleRow}>
            <View
                style={[
                    styles.sideSeat,
                    showWestDummy &&
                        styles.dummySideSeat
                ]}
            >
                {showWestDummy ? (
                    <SideDummyHandView
                        seat={Seat.West}
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
                    />
                ) : (
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
                )}
            </View>

<View
    style={[
        styles.centerArea,
        hasSideDummy &&
            styles.compactCenterArea
    ]}
>
    <TableCenter
        trick={displayedTrick}
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

            <View
                style={[
                    styles.sideSeat,
                    showEastDummy &&
                        styles.dummySideSeat
                ]}
            >
                {showEastDummy ? (
                    <SideDummyHandView
                        seat={Seat.East}
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
                    />
                ) : (
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
                )}
            </View>
        </View>
    );
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

    dummySideSeat: {
        width: 104
    },

    centerArea: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 2
    },

    compactCenterArea: {
        minWidth: 135,
        paddingHorizontal: 0
    },


});