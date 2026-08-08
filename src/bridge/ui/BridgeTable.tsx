import React, {
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

import {
    suitSymbol
} from "../cards/SuitDisplay";

import { Game } from "../core/Game";
import { Seat } from "../core/Seat";
import { Trick } from "../play/Trick";

import {
    PlayDecision
} from "../ai/PlayDecision";

import SouthHandView from "./SouthHandView";
import TablePlayArea from "./TablePlayArea";
import NorthArea from "./NorthArea";

import TableHeader from "./TableHeader";
import EndOfHandSummary from "./EndOfHandSummary";
import TrickHistoryView from "./TrickHistoryView";
import HintModal from "./HintModal";

import {
    RubberHandResult,
    RubberState
} from "../scoring/RubberBridgeScoring";

import {
    ScoringMode
} from "./WelcomeScreen";

interface Props {
    game: Game;

    displayedTrick: Trick;

    dummyVisible: boolean;

    southCanPlay: boolean;
    northCanPlay: boolean;

    statusMessage: string;

    showCompletedTrick: boolean;

    completedTrickWinner?: Seat;

    collectingCompletedTrick:
        boolean;

    historyVisible: boolean;

    canUndo: boolean;

    playHint:
        PlayDecision | null;

    playHintVisible: boolean;

    onShowHistory: () => void;
    onCloseHistory: () => void;

    onUndo: () => void;

    onShowHint: () => void;
    onCloseHint: () => void;

    onPlayHumanCard: (
        seat: Seat,
        index: number
    ) => void;

    onNewHand: () => void;

    scoringMode: ScoringMode;

    rubberState: RubberState;

    rubberHandResult:
        RubberHandResult | null;
}

export default function BridgeTable({
    game,
    scoringMode,
    rubberState,
    rubberHandResult,
    displayedTrick,
    dummyVisible,
    southCanPlay,
    northCanPlay,
    statusMessage,
    showCompletedTrick,
    completedTrickWinner,
    collectingCompletedTrick,
    historyVisible,
    canUndo,
    playHint,
    playHintVisible,
    onShowHistory,
    onCloseHistory,
    onUndo,
    onShowHint,
    onCloseHint,
    onPlayHumanCard,
    onNewHand
}: Props) {
    const northHand =
        game.handOf(
            Seat.North
        );

    const southHand =
        game.handOf(
            Seat.South
        );

    const activeLeadSuit =
        game.table
            .currentTrick
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
     * Normal North visibility.
     *
     * North is visible when:
     *
     * 1. North is human controlled, or
     * 2. North is dummy and the opening
     *    lead has already been made.
     */
    const showNorthHand =
        northIsHuman ||
        (
            northIsDummy &&
            dummyVisible
        );

    /*
     * Suggested card belongs only to
     * the seat whose turn it currently is.
     */
    const suggestedNorthCard =
        playHint &&
        game.currentSeat ===
            Seat.North
            ? playHint.card
            : undefined;

    const suggestedSouthCard =
        playHint &&
        game.currentSeat ===
            Seat.South
            ? playHint.card
            : undefined;

    /*
     * =====================================================
     * SHOW / HIDE ALL HANDS
     * =====================================================
     *
     * This does NOT affect who controls
     * the cards.
     *
     * It only reveals normally hidden cards.
     */
    const [
        showAllHands,
        setShowAllHands
    ] = useState(false);

    const hintDisabled =
        game.isFinished() ||
        showCompletedTrick ||
        !game.isHumanControlled(
            game.currentSeat
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
                    contract={
                        game.contract
                    }
                    nsTricks={
                        game.table.nsTricks
                    }
                    ewTricks={
                        game.table.ewTricks
                    }
                    onNewHand={
                        onNewHand
                    }
                />

                <Text
                    style={
                        styles.contractRoles
                    }
                >
                    Declarer:{" "}
                    {game.declarerSeat()}
                    {"   "}
                    Dummy:{" "}
                    {game.dummySeat()}
                </Text>

                <TrickHistoryView
                    game={game}
                    visible={
                        historyVisible
                    }
                    onClose={
                        onCloseHistory
                    }
                />

                {/*
                 * =========================================
                 * ACTION BUTTONS
                 * =========================================
                 */}

                <View style={styles.actionRow}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel=
                            "Undo to your previous turn"
                        disabled={
                            !canUndo
                        }
                        onPress={
                            onUndo
                        }
                        style={({
                            pressed
                        }) => [
                            styles.actionButton,

                            !canUndo &&
                                styles
                                    .disabledActionButton,

                            pressed &&
                                canUndo &&
                                styles
                                    .actionButtonPressed
                        ]}
                    >
                        <Text
                            style={[
                                styles
                                    .actionButtonText,

                                !canUndo &&
                                    styles
                                        .disabledActionText
                            ]}
                        >
                            Undo
                        </Text>
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel=
                            "Suggest a card to play"
                        disabled={
                            hintDisabled
                        }
                        onPress={
                            onShowHint
                        }
                        style={({
                            pressed
                        }) => [
                            styles.actionButton,
                            styles.hintButton,

                            hintDisabled &&
                                styles
                                    .disabledActionButton,

                            pressed &&
                                !hintDisabled &&
                                styles
                                    .actionButtonPressed
                        ]}
                    >
                        <Text
                            style={[
                                styles
                                    .actionButtonText,

                                styles
                                    .hintButtonText,

                                hintDisabled &&
                                    styles
                                        .disabledActionText
                            ]}
                        >
                            Hint
                        </Text>
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel=
                            "Open trick history"
                        onPress={
                            onShowHistory
                        }
                        style={({
                            pressed
                        }) => [
                            styles.actionButton,

                            pressed &&
                                styles
                                    .actionButtonPressed
                        ]}
                    >
                        <Text
                            style={
                                styles
                                    .actionButtonText
                            }
                        >
                            History
                        </Text>
                    </Pressable>

                    {/*
                     * =====================================
                     * SHOW / HIDE HANDS
                     * =====================================
                     */}

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={
                            showAllHands
                                ? "Hide opponent cards"
                                : "Show opponent cards"
                        }
                        onPress={() =>
                            setShowAllHands(
                                current =>
                                    !current
                            )
                        }
                        style={({
                            pressed
                        }) => [
                            styles.actionButton,
                            styles.handsButton,

                            showAllHands &&
                                styles
                                    .handsButtonActive,

                            pressed &&
                                styles
                                    .actionButtonPressed
                        ]}
                    >
                        <Text
                            style={[
                                styles
                                    .actionButtonText,

                                showAllHands &&
                                    styles
                                        .handsButtonActiveText
                            ]}
                        >
                            {showAllHands
                                ? "Hide Hands"
                                : "Show Hands"}
                        </Text>
                    </Pressable>
                </View>

                {/*
                 * =========================================
                 * NORTH
                 * =========================================
                 */}

                <NorthArea
                    hand={
                        northHand
                    }

                    /*
                     * Normal showHand logic is preserved.
                     *
                     * showAllHands is passed separately
                     * so NorthArea can distinguish a
                     * legitimate dummy from a revealed
                     * hidden hand.
                     */
                    showHand={
                        showNorthHand
                    }

                    showAllHands={
                        showAllHands
                    }

                    isDummy={
                        northIsDummy
                    }

                    leadSuit={
                        activeLeadSuit
                    }

                    trump={
                        game.contract.trump
                    }

                    enabled={
                        northCanPlay
                    }

                    active={
                        !showCompletedTrick &&
                        game.currentSeat ===
                            Seat.North
                    }

                    suggestedCard={
                        suggestedNorthCard
                    }

                    onCardPlayed={
                        onPlayHumanCard
                    }
                />

                {/*
                 * =========================================
                 * CENTER TABLE / EAST / WEST
                 * =========================================
                 */}

                <TablePlayArea
                    game={game}

                    displayedTrick={
                        displayedTrick
                    }

                    showCompletedTrick={
                        showCompletedTrick
                    }

                    completedTrickWinner={
                        completedTrickWinner
                    }

                    collectingCompletedTrick={
                        collectingCompletedTrick
                    }

                    dummyVisible={
                        dummyVisible
                    }

                    /*
                     * NEW:
                     * TablePlayArea will reveal East
                     * and West when this is true.
                     */
                    showAllHands={
                        showAllHands
                    }
                />

                {/*
                 * =========================================
                 * SOUTH
                 * =========================================
                 */}

                <SouthHandView
                    hand={
                        southHand
                    }

                    leadSuit={
                        activeLeadSuit
                    }

                    enabled={
                        southCanPlay
                    }

                    statusMessage={
                        statusMessage
                    }

                    highlightStatus={
                        southCanPlay ||
                        northCanPlay
                    }

                    title={
                        southIsDummy &&
                        dummyVisible
                            ? "South"
                            : "South — You"
                    }

                    isDummy={
                        southIsDummy &&
                        dummyVisible
                    }

                    suggestedCard={
                        suggestedSouthCard
                    }

                    trump={
                        game.contract.trump
                    }

                    onCardPlayed={
                        index =>
                            onPlayHumanCard(
                                Seat.South,
                                index
                            )
                    }
                />

                {/*
                 * =========================================
                 * END OF HAND / SCORING
                 * =========================================
                 */}

                {game.isFinished() && (
                    <EndOfHandSummary
                        game={
                            game
                        }

                        scoringMode={
                            scoringMode
                        }

                        rubberState={
                            rubberState
                        }

                        rubberHandResult={
                            rubberHandResult
                        }

                        onNewHand={
                            onNewHand
                        }
                    />
                )}

                {/*
                 * =========================================
                 * PLAY HINT
                 * =========================================
                 */}

                {playHint && (
                    <HintModal
                        visible={
                            playHintVisible
                        }

                        heading=
                            "Suggested play"

                        recommendation={
                            `${displayRank(
                                playHint
                                    .card
                                    .rank
                            )}${suitSymbol(
                                playHint
                                    .card
                                    .suit
                            )}`
                        }

                        rule={
                            playHint
                                .explanation
                                .rule
                        }

                        summary={
                            playHint
                                .explanation
                                .summary
                        }

                        facts={
                            playHint
                                .explanation
                                .facts
                        }

                        alternatives={
                            playHint
                                .explanation
                                .alternatives
                        }

                        onClose={
                            onCloseHint
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

function displayRank(
    rank: number
): string {
    switch (rank) {
        case 14:
            return "A";

        case 13:
            return "K";

        case 12:
            return "Q";

        case 11:
            return "J";

        default:
            return String(rank);
    }
}

const styles =
StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor:
            "#145A32"
    },

    container: {
        flex: 1,
        position: "relative",
        backgroundColor:
            "#1B7040",
        paddingTop: 6,
        paddingHorizontal: 8,
        paddingBottom: 8
    },

    contractRoles: {
        color: "#E8F5E9",
        fontSize: 12,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 2,
        includeFontPadding: false
    },

    /*
     * Four buttons may not fit on one
     * row on a smaller iPhone.
     *
     * flexWrap allows the Hands button
     * to drop cleanly to a second row.
     */
    actionRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 7,
        marginTop: 6,
        marginBottom: 4
    },

    actionButton: {
        minWidth: 82,
        minHeight: 40,
        backgroundColor:
            "#FFFFFF",
        borderWidth: 2,
        borderColor:
            "#D7E8DB",
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8
    },

    hintButton: {
        backgroundColor:
            "#E8F5E9",
        borderColor:
            "#66A96F"
    },

    /*
     * Show Hands button is slightly
     * different so it is easy to find.
     */
    handsButton: {
        backgroundColor:
            "#FFFDE7",
        borderColor:
            "#D6B638"
    },

    /*
     * When cards are revealed, make the
     * button yellow so it is obvious that
     * Show Hands mode is active.
     */
    handsButtonActive: {
        backgroundColor:
            "#FFEB3B",
        borderColor:
            "#F9A825"
    },

    handsButtonActiveText: {
        color: "#1B1B1B"
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
        fontWeight: "800",
        includeFontPadding: false
    },

    hintButtonText: {
        color: "#1B5E20"
    },

    disabledActionButton: {
        backgroundColor:
            "#D8DDD9",
        borderColor:
            "#C5CBC6"
    },

    disabledActionText: {
        color: "#929892"
    }
});