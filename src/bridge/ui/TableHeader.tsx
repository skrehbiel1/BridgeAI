import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

interface Props {
    nsTricks: number;
    ewTricks: number;
    onNewHand: () => void;
}

export default function TableHeader({
    nsTricks,
    ewTricks,
    onNewHand
}: Props) {
    return (
        <View style={styles.headerRow}>
            <View style={styles.titleArea}>
                <Text style={styles.title}>
                    BridgeAI
                </Text>

                <Text style={styles.contract}>
                    Contract: 4♠ by South
                </Text>
            </View>

            <View style={styles.rightHeader}>
                <View style={styles.scorePanel}>
                    <Text style={styles.scoreText}>
                        NS {nsTricks}
                    </Text>

                    <Text style={styles.scoreText}>
                        EW {ewTricks}
                    </Text>
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Deal a new bridge hand"
                    onPress={onNewHand}
                    style={({ pressed }) => [
                        styles.newHandButton,
                        pressed &&
                            styles.newHandButtonPressed
                    ]}
                >
                    <Text style={styles.newHandButtonText}>
                        New Hand
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingHorizontal: 6
    },

    titleArea: {
        flex: 1,
        paddingRight: 12
    },

    title: {
        color: "#FFFFFF",
        fontSize: 26,
        fontWeight: "700",
        lineHeight: 31,
        includeFontPadding: false
    },

    contract: {
        color: "#E8F5E9",
        fontSize: 14,
        marginTop: 1,
        includeFontPadding: false
    },

    rightHeader: {
        minWidth: 94,
        alignItems: "stretch"
    },

    scorePanel: {
        minWidth: 68,
        borderRadius: 9,
        backgroundColor:
            "rgba(0, 0, 0, 0.23)",
        paddingHorizontal: 12,
        paddingVertical: 6
    },

    scoreText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
        lineHeight: 20,
        textAlign: "right",
        includeFontPadding: false
    },

    newHandButton: {
        minHeight: 40,
        marginTop: 7,
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#FFF176",
        backgroundColor: "#FFEB3B",
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        shadowColor: "#000000",
        shadowOpacity: 0.28,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 3
        }
    },

    newHandButtonPressed: {
        backgroundColor: "#FDD835",
        borderColor: "#F9A825",
        opacity: 0.9,
        transform: [
            {
                scale: 0.97
            }
        ]
    },

    newHandButtonText: {
        color: "#1B1B1B",
        fontSize: 15,
        fontWeight: "800",
        lineHeight: 19,
        includeFontPadding: false,
        textAlign: "center"
    }
});