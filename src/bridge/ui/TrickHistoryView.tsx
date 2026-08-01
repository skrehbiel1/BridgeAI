import React from "react";

import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import { Game } from "../core/Game";
import { suitSymbol } from "../cards/SuitDisplay";

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
                            Trick History
                        </Text>

                        <Pressable
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeText}>
                                Close
                            </Text>
                        </Pressable>
                    </View>

                    <ScrollView>
                        {tricks.length === 0 ? (
                            <Text style={styles.emptyText}>
                                No completed tricks yet.
                            </Text>
                        ) : (
                            tricks.map((trick, trickIndex) => (
                                <View
                                    key={trickIndex}
                                    style={styles.trickCard}
                                >
                                    <Text style={styles.trickTitle}>
                                        Trick {trickIndex + 1}
                                    </Text>

                                    {trick.plays.map(
                                        (play, playIndex) => (
                                            <Text
                                                key={playIndex}
                                                style={styles.playText}
                                            >
                                                {play.seat}:{" "}
                                                {displayRank(
                                                    play.card.rank
                                                )}
                                                {suitSymbol(
                                                    play.card.suit
                                                )}
                                            </Text>
                                        )
                                    )}

                                    <Text style={styles.winnerText}>
                                        Winner:{" "}
                                        {trick.winner ?? "Pending"}
                                    </Text>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
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

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "flex-end"
    },

    panel: {
        maxHeight: "78%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 16
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
    },

    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#173A26"
    },

    closeButton: {
        backgroundColor: "#E0E0E0",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 7
    },

    closeText: {
        color: "#222222",
        fontWeight: "700"
    },

    emptyText: {
        color: "#666666",
        textAlign: "center",
        paddingVertical: 24
    },

    trickCard: {
        backgroundColor: "#F7F7F7",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10
    },

    trickTitle: {
        fontSize: 17,
        fontWeight: "800",
        marginBottom: 6,
        color: "#222222"
    },

    playText: {
        fontSize: 15,
        color: "#333333",
        marginBottom: 2
    },

    winnerText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2E7D32",
        marginTop: 7
    }
});