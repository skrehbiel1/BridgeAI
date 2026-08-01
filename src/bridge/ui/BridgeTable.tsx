import React from "react";

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
import { Trick } from "../play/Trick";

import SouthHandView from "./SouthHandView";
import TablePlayArea from "./TablePlayArea";
import NorthArea from "./NorthArea";

import HandView from "./HandView";
import TableCenter from "./TableCenter";
import TableHeader from "./TableHeader";

import EndOfHandSummary from "./EndOfHandSummary";

import TrickHistoryView from "./TrickHistoryView";

interface Props {
    game: Game;
    displayedTrick: Trick;
    dummyVisible: boolean;
    southCanPlay: boolean;
    northCanPlay: boolean;
    statusMessage: string;
    showCompletedTrick: boolean;

    historyVisible: boolean;
    onShowHistory: () => void;
    onCloseHistory: () => void;

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
    historyVisible,
    onShowHistory,
    onCloseHistory,
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
<Pressable
    onPress={onShowHistory}
    style={styles.historyButton}
>
    <Text style={styles.historyButtonText}>
        History
    </Text>
</Pressable>
<TrickHistoryView
    game={game}
    visible={historyVisible}
    onClose={onCloseHistory}
/>
<NorthArea
    hand={northHand}
    dummyVisible={dummyVisible}
    leadSuit={activeLeadSuit}
    enabled={northCanPlay}
    active={
        !showCompletedTrick &&
        game.currentSeat === Seat.North
    }
    onCardPlayed={onPlayHumanCard}
/>

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

{game.isFinished() && (
    <EndOfHandSummary
        game={game}
        onNewHand={onNewHand}
    />
)}

          </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#145A32"
    },
historyButton: {
    alignSelf: "center",
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8
},

historyButtonText: {
    color: "#173A26",
    fontSize: 14,
    fontWeight: "800"
},
    container: {
        flex: 1,
	position: "relative",
        backgroundColor: "#1B7040",
        paddingTop: 6,
        paddingHorizontal: 8,
        paddingBottom: 8
    },


});