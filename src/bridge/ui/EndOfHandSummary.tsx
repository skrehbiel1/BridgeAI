import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import { Game } from "../core/Game";

interface Props {
    game: Game;
    onNewHand: () => void;
}

export default function EndOfHandSummary({
    game,
    onNewHand
}: Props) {
    const declarerTricks =
        game.contractTricksWon();

    const requiredTricks =
        game.contract.requiredTricks();

    const difference =
        declarerTricks - requiredTricks;

    const made =
        game.contractMade();

    const resultText =
        getResultText(
            made,
            difference
        );

    return (
        <View style={styles.overlay}>
            <View style={styles.panel}>
                <Text style={styles.title}>
                    Hand Complete
                </Text>

                <Text style={styles.contract}>
                    {game.contract.toString()} by{" "}
                    {game.contract.declarer}
                </Text>

                <Text
                    style={[
                        styles.result,
                        made
                            ? styles.made
                            : styles.down
                    ]}
                >
                    {resultText}
                </Text>

                <View style={styles.trickRow}>
                    <Text style={styles.trickLabel}>
                        Declarer tricks
                    </Text>

                    <Text style={styles.trickValue}>
                        {declarerTricks}
                    </Text>
                </View>

                <View style={styles.trickRow}>
                    <Text style={styles.trickLabel}>
                        Required tricks
                    </Text>

                    <Text style={styles.trickValue}>
                        {requiredTricks}
                    </Text>
                </View>

                <View style={styles.trickRow}>
                    <Text style={styles.trickLabel}>
                        NS
                    </Text>

                    <Text style={styles.trickValue}>
                        {game.table.nsTricks}
                    </Text>
                </View>

                <View style={styles.trickRow}>
                    <Text style={styles.trickLabel}>
                        EW
                    </Text>

                    <Text style={styles.trickValue}>
                        {game.table.ewTricks}
                    </Text>
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Deal a new bridge hand"
                    onPress={onNewHand}
                    style={({ pressed }) => [
                        styles.button,
                        pressed &&
                            styles.buttonPressed
                    ]}
                >
                    <Text style={styles.buttonText}>
                        New Hand
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

function getResultText(
    made: boolean,
    difference: number
): string {
    if (!made) {
        return `Down ${Math.abs(difference)}`;
    }

    if (difference === 0) {
        return "Contract Made";
    }

    return `Made ${difference}`;
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor:
            "rgba(0, 0, 0, 0.58)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        zIndex: 20
    },

    panel: {
        width: "100%",
        maxWidth: 330,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingHorizontal: 22,
        paddingVertical: 20,
        elevation: 10,
        shadowColor: "#000000",
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4
        }
    },

    title: {
        color: "#173A26",
        fontSize: 25,
        fontWeight: "800",
        textAlign: "center",
        includeFontPadding: false
    },

    contract: {
        color: "#555555",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 5,
        includeFontPadding: false
    },

    result: {
        fontSize: 24,
        fontWeight: "800",
        textAlign: "center",
        marginVertical: 16,
        includeFontPadding: false
    },

    made: {
        color: "#2E7D32"
    },

    down: {
        color: "#C62828"
    },

    trickRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE"
    },

    trickLabel: {
        color: "#444444",
        fontSize: 15
    },

    trickValue: {
        color: "#222222",
        fontSize: 15,
        fontWeight: "700"
    },

    button: {
        minHeight: 46,
        backgroundColor: "#FFEB3B",
        borderWidth: 2,
        borderColor: "#F9A825",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },

    buttonPressed: {
        backgroundColor: "#FDD835",
        transform: [
            {
                scale: 0.98
            }
        ]
    },

    buttonText: {
        color: "#1B1B1B",
        fontSize: 17,
        fontWeight: "800",
        includeFontPadding: false
    }
});