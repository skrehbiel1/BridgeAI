import React from "react";

import {
    StyleSheet,
    View
} from "react-native";

import { Game } from "../core/Game";
import { Seat } from "../core/Seat";
import { Trick } from "../play/Trick";

import SeatView from "./SeatView";
import TableCenter from "./TableCenter";

interface Props {
    game: Game;
    displayedTrick: Trick;
    showCompletedTrick: boolean;
    completedTrickWinner?: Seat;
    collectingCompletedTrick: boolean;
}

export default function TablePlayArea({
    game,
    displayedTrick,
    showCompletedTrick,
    completedTrickWinner,
    collectingCompletedTrick
}: Props) {
    return (
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
    );
}

const styles = StyleSheet.create({
    middleRow: {
        flex: 1,
        width: "100%",
        minHeight: 175,
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
    }
});