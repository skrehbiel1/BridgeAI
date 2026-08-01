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
import TablePlayArea from "./TablePlayArea";

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
showCompletedTrick: boolean;

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
showCompletedTrick,
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

<TablePlayArea
    game={game}
    displayedTrick={displayedTrick}
    showCompletedTrick={
        showCompletedTrick
    }
/>

  
 
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


});