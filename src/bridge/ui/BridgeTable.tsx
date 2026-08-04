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
completedTrickWinner?: Seat;
    collectingCompletedTrick: boolean;
    historyVisible: boolean;
    onShowHistory: () => void;
    onCloseHistory: () => void;
    canUndo: boolean;
    onUndo: () => void;

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
    completedTrickWinner,
    collectingCompletedTrick,
    canUndo,
    onUndo,
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

const northIsDummy =
    game.isDummy(
        Seat.North
    );

const southIsDummy =
    game.isDummy(
        Seat.South
    );

const northIsHuman =
    game.isHumanControlled(
        Seat.North
    );

/*
 * Show North when:
 *
 * - North is controlled by the human, or
 * - North is dummy and the opening lead
 *   has already been made.
 */
const showNorthHand =
    northIsHuman ||
    (
        northIsDummy &&
        dummyVisible
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
    contract={game.contract}
    nsTricks={game.table.nsTricks}
    ewTricks={game.table.ewTricks}
    onNewHand={onNewHand}
/>

<TrickHistoryView
    game={game}
    visible={historyVisible}
    onClose={onCloseHistory}
/>

<View style={styles.actionRow}>
    <Pressable
        accessibilityRole="button"
        accessibilityLabel="Undo to your previous turn"
        disabled={!canUndo}
        onPress={onUndo}
        style={({ pressed }) => [
            styles.actionButton,
            !canUndo &&
                styles.disabledActionButton,
            pressed &&
                canUndo &&
                styles.actionButtonPressed
        ]}
    >
        <Text
            style={[
                styles.actionButtonText,
                !canUndo &&
                    styles.disabledActionText
            ]}
        >
            Undo
        </Text>
    </Pressable>

    <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open trick history"
        onPress={onShowHistory}
        style={({ pressed }) => [
            styles.actionButton,
            pressed &&
                styles.actionButtonPressed
        ]}
    >
        <Text style={styles.actionButtonText}>
            History
        </Text>
    </Pressable>
</View>


<NorthArea
    hand={northHand}
    showHand={showNorthHand}
    isDummy={northIsDummy}
    leadSuit={activeLeadSuit}
    enabled={northCanPlay}
    active={
        !showCompletedTrick &&
        game.currentSeat ===
            Seat.North
    }
    onCardPlayed={
        onPlayHumanCard
    }
/>

<TablePlayArea
    game={game}
    displayedTrick={displayedTrick}
    showCompletedTrick={showCompletedTrick}
    completedTrickWinner={
        completedTrickWinner
    }
    collectingCompletedTrick={
        collectingCompletedTrick
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
    title="South — You"
    isDummy={
        southIsDummy &&
        dummyVisible
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

    container: {
        flex: 1,
	position: "relative",
        backgroundColor: "#1B7040",
        paddingTop: 6,
        paddingHorizontal: 8,
        paddingBottom: 8
    },

actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 6
},

actionButton: {
    minWidth: 95,
    minHeight: 40,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#D7E8DB",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14
},

actionButtonPressed: {
    opacity: 0.75,
    transform: [
        {
            scale: 0.97
        }
    ]
},

actionButtonText: {
    color: "#173A26",
    fontSize: 14,
    fontWeight: "800"
},

disabledActionButton: {
    backgroundColor: "#D8DDD9",
    borderColor: "#C5CBC6"
},

disabledActionText: {
    color: "#929892"
}



});