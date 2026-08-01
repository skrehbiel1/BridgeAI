import React from "react";

import {
    StyleSheet,
    View
} from "react-native";

import {
    SafeAreaView
} from "react-native-safe-area-context";

import { Game } from "../core/Game";
import { Seat } from "../core/Seat";
import { Trick } from "../play/Trick";

import DummyHandView from "./DummyHandView";
import SouthHandView from "./SouthHandView";

import HandView from "./HandView";
import SeatView from "./SeatView";
import TableCenter from "./TableCenter";
import TableHeader from "./TableHeader";

interface Props {
    game: Game;
    displayedTrick: Trick;
    dummyVisible: boolean;
    southCanPlay: boolean;
    northCanPlay: boolean;
    statusMessage: string;

    onPlayHumanCard: (
        seat: Seat,
        index: number
    ) => void;

    onNewHand: () => void;
}

export default function BridgeTable({
    game,
    displayedTrick,
    dummyVisible,
    southCanPlay,
    northCanPlay,
    statusMessage,
    onPlayHumanCard,
    onNewHand
}: Props) {
    const northHand =
        game.handOf(Seat.North);

    const southHand =
        game.handOf(Seat.South);

    const activeLeadSuit =
        game.table.currentTrick
            .leadSuit;

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
                    nsTricks={
                        game.table.nsTricks
                    }
                    ewTricks={
                        game.table.ewTricks
                    }
                    onNewHand={onNewHand}
                />

                <View style={styles.northRow}>
                    {dummyVisible ? (
     <DummyHandView
    hand={northHand}
    leadSuit={activeLeadSuit}
    enabled={northCanPlay}
    onCardPlayed={
        index =>
            onPlayHumanCard(
                Seat.North,
                index
            )
    }
/>
                    ) : (
                        <SeatView
                            name="North"
                            cardCount={
                                northHand.cards.length
                            }
                            orientation="horizontal"
                            active={
                                game.currentSeat ===
                                Seat.North
                            }
                        />
                    )}
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
                            trick={
                                displayedTrick
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
                                game.currentSeat ===
                                Seat.East
                            }
                        />
                    </View>
                </View>

 
<SouthHandView
    hand={southHand}
    leadSuit={activeLeadSuit}
    enabled={southCanPlay}
    statusMessage={statusMessage}
    highlightStatus={
        southCanPlay ||
        northCanPlay
    }
    onCardPlayed={
        index =>
            onPlayHumanCard(
                Seat.South,
                index
            )
    }
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
        paddingTop: 6,
        paddingHorizontal: 8,
        paddingBottom: 8
    },

    northRow: {
        minHeight: 94,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4
    },

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
    },


});