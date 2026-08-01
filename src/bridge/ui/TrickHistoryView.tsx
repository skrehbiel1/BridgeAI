import React, {
    useEffect,
    useState
} from "react";

import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    Card,
    Suit
} from "../cards/Card";

import { Game } from "../core/Game";
import { Seat } from "../core/Seat";
import { suitSymbol } from "../cards/SuitDisplay";
import { TrickRecord } from "../replay/TrickRecord";

interface Props {
    game: Game;
    visible: boolean;
    onClose: () => void;
}

export default function TrickHistoryView({
    game,
    visible,
    onClose
}: Props) {
    const tricks =
        game.trickHistory();

    const [
        selectedIndex,
        setSelectedIndex
    ] = useState(0);
const [
    replayCount,
    setReplayCount
] = useState(4);

    /*
     * When History opens, begin with the most
     * recently completed trick.
     */
    useEffect(() => {
        if (!visible) {
            return;
        }

        setSelectedIndex(
            Math.max(
                tricks.length - 1,
                0
            )
        );
    }, [
        visible,
        tricks.length
    ]);

    const selectedTrick =
        tricks[selectedIndex];

    const canGoPrevious =
        selectedIndex > 0;

    const canGoNext =
        selectedIndex <
        tricks.length - 1;

    function showPrevious(): void {
        if (!canGoPrevious) {
            return;
        }

        setSelectedIndex(
            current => current - 1
        );
    }

    function showNext(): void {
        if (!canGoNext) {
            return;
        }

        setSelectedIndex(
            current => current + 1
        );
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.panel}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Trick Replay
                        </Text>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Close trick replay"
                            onPress={onClose}
                            style={({ pressed }) => [
                                styles.closeButton,
                                pressed &&
                                    styles.buttonPressed
                            ]}
                        >
                            <Text style={styles.closeText}>
                                Close
                            </Text>
                        </Pressable>
                    </View>

                    {selectedTrick ? (
                        <>
                            <Text style={styles.trickNumber}>
                                Trick {selectedIndex + 1}
                                {" of "}
                                {tricks.length}
                            </Text>

                            <ReplayTable
                                trick={selectedTrick}
				replayCount={replayCount}
                            />
<Pressable
onPress={() => {

    setReplayCount(0);

    let current = 0;

    const timer =
        setInterval(() => {

            current++;

            setReplayCount(current);

            if (current >= 4) {

                clearInterval(timer);

            }

        }, 450);

}}
    style={({ pressed }) => [
        styles.navigationButton,
        pressed && styles.buttonPressed
    ]}
>
    <Text style={styles.navigationText}>
        Replay Trick
    </Text>
</Pressable>

                            <Text style={styles.winnerText}>
                                Winner:{" "}
                                {
                                    selectedTrick.winner ??
                                    "Pending"
                                }
                            </Text>

                            <View style={styles.navigationRow}>
                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Show previous trick"
                                    disabled={!canGoPrevious}
                                    onPress={showPrevious}
                                    style={({ pressed }) => [
                                        styles.navigationButton,
                                        !canGoPrevious &&
                                            styles.disabledButton,
                                        pressed &&
                                            canGoPrevious &&
                                            styles.buttonPressed
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.navigationText,
                                            !canGoPrevious &&
                                                styles.disabledText
                                        ]}
                                    >
                                        Previous
                                    </Text>
                                </Pressable>

                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Show next trick"
                                    disabled={!canGoNext}
                                    onPress={showNext}
                                    style={({ pressed }) => [
                                        styles.navigationButton,
                                        !canGoNext &&
                                            styles.disabledButton,
                                        pressed &&
                                            canGoNext &&
                                            styles.buttonPressed
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.navigationText,
                                            !canGoNext &&
                                                styles.disabledText
                                        ]}
                                    >
                                        Next
                                    </Text>
                                </Pressable>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.emptyText}>
                            No completed tricks yet.
                        </Text>
                    )}
                </View>
            </View>
        </Modal>
    );
}

function ReplayTable({
    trick,
    replayCount = 4
}: {
    trick: TrickRecord;
    replayCount?: number;
}) {
    
    const visiblePlays =
    trick.plays.slice(
        0,
        replayCount
    );
     const playAt = (
        seat: Seat
    ) =>
        visiblePlays.find(
            play => play.seat === seat
        );

    const north =
        playAt(Seat.North);

    const east =
        playAt(Seat.East);

    const south =
        playAt(Seat.South);

    const west =
        playAt(Seat.West);

    return (
        <View style={styles.table}>
            <View style={styles.northPosition}>
                {north && (
                    <ReplayCard
                        card={north.card}
                        winner={
                            trick.winner ===
                            Seat.North
                        }
                    />
                )}
            </View>

            <View style={styles.westPosition}>
                {west && (
                    <ReplayCard
                        card={west.card}
                        winner={
                            trick.winner ===
                            Seat.West
                        }
                    />
                )}
            </View>

            <Text style={styles.centerLabel}>
                Replay
            </Text>

            <View style={styles.eastPosition}>
                {east && (
                    <ReplayCard
                        card={east.card}
                        winner={
                            trick.winner ===
                            Seat.East
                        }
                    />
                )}
            </View>

            <View style={styles.southPosition}>
                {south && (
                    <ReplayCard
                        card={south.card}
                        winner={
                            trick.winner ===
                            Seat.South
                        }
                    />
                )}
            </View>
        </View>
    );
}

function ReplayCard({
    card,
    winner
}: {
    card: Card;
    winner: boolean;
}) {
    return (
        <View
            style={[
                styles.card,
                winner &&
                    styles.winningCard
            ]}
        >
            <Text
                style={[
                    styles.cardText,
                    {
                        color:
                            suitColor(
                                card.suit
                            )
                    }
                ]}
            >
                {displayRank(card.rank)}
                {suitSymbol(card.suit)}
            </Text>
        </View>
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

function suitColor(
    suit: Suit
): string {
    if (
        suit === Suit.Hearts ||
        suit === Suit.Diamonds
    ) {
        return "#C62828";
    }

    return "#111111";
}

const CARD_WIDTH = 50;
const CARD_HEIGHT = 62;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor:
            "rgba(0, 0, 0, 0.58)",
        justifyContent: "flex-end"
    },

    panel: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 24
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    title: {
        color: "#173A26",
        fontSize: 23,
        fontWeight: "800",
        includeFontPadding: false
    },

    closeButton: {
        backgroundColor: "#E0E0E0",
        borderRadius: 8,
        paddingHorizontal: 13,
        paddingVertical: 8
    },

    closeText: {
        color: "#222222",
        fontSize: 14,
        fontWeight: "700"
    },

    trickNumber: {
        color: "#444444",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 14,
        marginBottom: 10
    },

    table: {
        width: 230,
        height: 230,
        borderRadius: 115,
        alignSelf: "center",
        position: "relative",
        backgroundColor: "#08752F",
        borderWidth: 3,
        borderColor: "#075324"
    },

    centerLabel: {
        position: "absolute",
        top: 104,
        alignSelf: "center",
        color: "rgba(255,255,255,0.55)",
        fontSize: 12,
        fontWeight: "700"
    },

    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#333333",
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3
    },

    winningCard: {
        borderWidth: 3,
        borderColor: "#FFD600",
        backgroundColor: "#FFFDE7",
        elevation: 8
    },

    cardText: {
        fontSize: 19,
        fontWeight: "800",
        includeFontPadding: false
    },

    northPosition: {
        position: "absolute",
        top: 14,
        left: 87,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },

    southPosition: {
        position: "absolute",
        bottom: 14,
        left: 87,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },

    westPosition: {
        position: "absolute",
        top: 82,
        left: 17,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },

    eastPosition: {
        position: "absolute",
        top: 82,
        right: 17,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },

    winnerText: {
        color: "#2E7D32",
        fontSize: 17,
        fontWeight: "800",
        textAlign: "center",
        marginTop: 12
    },

    navigationRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 18
    },

    navigationButton: {
        flex: 1,
        minHeight: 45,
        backgroundColor: "#FFEB3B",
        borderWidth: 2,
        borderColor: "#F9A825",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },

    navigationText: {
        color: "#1B1B1B",
        fontSize: 15,
        fontWeight: "800"
    },

    disabledButton: {
        backgroundColor: "#EEEEEE",
        borderColor: "#CCCCCC"
    },

    disabledText: {
        color: "#999999"
    },

    buttonPressed: {
        opacity: 0.75,
        transform: [
            {
                scale: 0.98
            }
        ]
    },

    emptyText: {
        color: "#666666",
        fontSize: 16,
        textAlign: "center",
        paddingVertical: 36
    }
});